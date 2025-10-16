import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';
import { sendAppointmentEmail, sendSellerNotificationEmail } from '../utils/emailService.js';

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = asyncHandler(async (req, res) => {
  const { propertyId, appointmentDate, appointmentTime, notes, buyerPhone, bidAmount } = req.body;

  // Validate required fields
  if (!propertyId || !appointmentDate || !appointmentTime) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Validate bid amount
  if (!bidAmount || bidAmount <= 0) {
    res.status(400);
    throw new Error('Please provide a valid bid amount');
  }

  // Get property details
  const property = await Property.findById(propertyId).populate('seller', 'username email');
  
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if user is trying to book their own property
  if (property.seller._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot book an appointment for your own property');
  }

  // Check if bid meets minimum requirement
  if (bidAmount < property.minimumBid) {
    res.status(400);
    throw new Error(`Bid must be at least $${property.minimumBid}`);
  }

  // Get highest bid for this property
  const sortedBids = property.bids.sort((a, b) => b.amount - a.amount);
  const highestBid = sortedBids.length > 0 ? sortedBids[0].amount : 0;

  // Check if user's bid is competitive (within reasonable range)
  if (highestBid > 0 && bidAmount < highestBid * 0.9) {
    res.status(400);
    throw new Error(`Your bid should be competitive. Current highest bid is $${highestBid}`);
  }

  // Create appointment
  const appointment = await Appointment.create({
    property: propertyId,
    buyer: req.user._id,
    seller: property.seller._id,
    appointmentDate,
    appointmentTime,
    notes: notes || '',
    buyerEmail: req.user.email,
    buyerPhone: buyerPhone || '',
    bidAmount: Number(bidAmount)
  });

  // Populate appointment details
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('buyer', 'username email')
    .populate('seller', 'username email')
    .populate('property', 'title address images price');

  // Create notification for seller
  await Notification.create({
    user: property.seller._id,
    type: 'appointment',
    title: 'New Appointment Request',
    message: `${req.user.username} has requested to view your property "${property.title}"`,
    relatedId: appointment._id,
    relatedModel: 'Appointment'
  });

  // Send emails
  try {
    // Email to buyer
    await sendAppointmentEmail({
      buyerEmail: req.user.email,
      buyerName: req.user.username,
      propertyTitle: property.title,
      appointmentDate,
      appointmentTime,
      sellerName: property.seller.username,
      propertyAddress: property.address
    });

    // Email to seller
    await sendSellerNotificationEmail(
      property.seller.email,
      property.seller.username,
      req.user.username,
      property.title,
      appointmentDate,
      appointmentTime
    );
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    // Don't fail the request if email fails
  }

  res.status(201).json(populatedAppointment);
});

// @desc    Get all appointments for logged-in user (as buyer or seller)
// @route   GET /api/appointments
// @access  Private
export const getUserAppointments = asyncHandler(async (req, res) => {
  const { role } = req.query; // 'buyer' or 'seller'

  let query = {};
  
  if (role === 'buyer') {
    query.buyer = req.user._id;
  } else if (role === 'seller') {
    query.seller = req.user._id;
  } else {
    // Get both buyer and seller appointments
    query = {
      $or: [
        { buyer: req.user._id },
        { seller: req.user._id }
      ]
    };
  }

  const appointments = await Appointment.find(query)
    .populate('buyer', 'username email profilePicture')
    .populate('seller', 'username email profilePicture')
    .populate('property', 'title address images price propertyType')
    .sort({ appointmentDate: -1 });

  res.json(appointments);
});

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('buyer', 'username email profilePicture')
    .populate('seller', 'username email profilePicture')
    .populate('property', 'title address images price propertyType description');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check if user is authorized to view this appointment
  if (
    appointment.buyer._id.toString() !== req.user._id.toString() &&
    appointment.seller._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this appointment');
  }

  res.json(appointment);
});

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private (seller only)
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Only seller can update appointment status
  if (appointment.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the property seller can update appointment status');
  }

  appointment.status = status;
  await appointment.save();

  const updatedAppointment = await Appointment.findById(appointment._id)
    .populate('buyer', 'username email')
    .populate('seller', 'username email')
    .populate('property', 'title address images price');

  // Create notification for buyer
  await Notification.create({
    user: appointment.buyer,
    type: 'appointment',
    title: 'Appointment Status Updated',
    message: `Your appointment has been ${status}`,
    relatedId: appointment._id,
    relatedModel: 'Appointment'
  });

  res.json(updatedAppointment);
});

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Both buyer and seller can cancel
  if (
    appointment.buyer.toString() !== req.user._id.toString() &&
    appointment.seller.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to cancel this appointment');
  }

  appointment.status = 'cancelled';
  await appointment.save();

  // Notify the other party
  const notifyUserId = appointment.buyer.toString() === req.user._id.toString() 
    ? appointment.seller 
    : appointment.buyer;

  await Notification.create({
    user: notifyUserId,
    type: 'appointment',
    title: 'Appointment Cancelled',
    message: `An appointment has been cancelled by ${req.user.username}`,
    relatedId: appointment._id,
    relatedModel: 'Appointment'
  });

  res.json({ message: 'Appointment cancelled successfully' });
});

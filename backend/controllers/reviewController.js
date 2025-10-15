import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';

// @desc    Create a new review for a seller/property
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { sellerId, propertyId, rating, comment, reviewType = 'both' } = req.body;

    if (!sellerId || !propertyId || !rating) {
        res.status(400);
        throw new Error('Please provide seller, property, and rating');
    }

    // Check if user already reviewed this property
    const existingReview = await Review.findOne({
        buyer: req.user._id,
        property: propertyId
    });

    if (existingReview) {
        res.status(400);
        throw new Error('You have already reviewed this property');
    }

    const review = new Review({
        seller: sellerId,
        buyer: req.user._id,
        property: propertyId,
        rating,
        comment,
        reviewType
    });

    await review.save();

    // Update the seller's average rating
    const reviews = await Review.find({ seller: sellerId });
    const user = await User.findById(sellerId);

    if (user) {
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        user.averageRating = (totalRating / reviews.length).toFixed(1);
        user.totalSales = reviews.length;
        await user.save();
    }

    // Create notification for seller
    await Notification.create({
        user: sellerId,
        type: 'review',
        title: 'New Review Received',
        message: `${req.user.username} left a ${rating}-star review`,
        relatedId: review._id,
        relatedModel: 'Review'
    });

    const populatedReview = await Review.findById(review._id)
        .populate('buyer', 'username profilePicture');

    res.status(201).json(populatedReview);
});

// @desc    Get all reviews for a specific seller
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
const getReviewsForSeller = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ seller: req.params.sellerId })
        .populate('buyer', 'username profilePicture')
        .populate('property', 'title images')
        .sort({ createdAt: -1 });
    res.json(reviews);
});

// @desc    Get all reviews for a specific property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
const getReviewsForProperty = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ property: req.params.propertyId })
        .populate('buyer', 'username profilePicture')
        .populate('seller', 'username')
        .sort({ createdAt: -1 });
    
    // Calculate average rating for this property
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
        : 0;

    res.json({
        reviews,
        averageRating: avgRating,
        totalReviews: reviews.length
    });
});

export { createReview, getReviewsForSeller, getReviewsForProperty };
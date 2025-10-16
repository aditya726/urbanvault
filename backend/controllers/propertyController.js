import asyncHandler from 'express-async-handler';
import Property from '../models/Property.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "property-listings" }, // Optional: organize uploads in a folder
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// @desc    Fetch all properties with filtering
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
    const { keyword, location, propertyType, minPrice, maxPrice, bedrooms, bathrooms } = req.query;

    const query = {};

    // Exclude seller's own properties if user is authenticated
    if (req.user && req.user._id) {
        query.seller = { $ne: req.user._id };
    }

    if (keyword) {
        query.title = { $regex: keyword, $options: 'i' };
    }
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }
    if (propertyType && propertyType !== 'All') {
        query.propertyType = propertyType;
    }
    if (bedrooms) {
        query.bedrooms = { $gte: Number(bedrooms) };
    }
    if (bathrooms) {
        query.bathrooms = { $gte: Number(bathrooms) };
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) {
            query.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            query.price.$lte = Number(maxPrice);
        }
    }

    const properties = await Property.find(query).populate('seller', 'username email profilePicture').sort({ createdAt: -1 });
    res.json(properties);
});

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id).populate('seller', 'username email profilePicture averageRating totalSales');

    if (property) {
        res.json(property);
    } else {
        res.status(404);
        throw new Error('Property not found');
    }
});

// @desc    Create a property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res) => {
    try {
        const { title, description, price, location, address, bedrooms, bathrooms, area, propertyType, amenities } = req.body;
        
        // 1. Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image.' });
        }

        // 2. Upload images to Cloudinary in parallel
        const uploadPromises = req.files.map(file => uploadFromBuffer(file.buffer));
        const uploadResults = await Promise.all(uploadPromises);
        
        // 3. Get the secure URLs of the uploaded images
        const imageUrls = uploadResults.map(result => result.secure_url);

        // 4. Create a new property instance with the data
        const newProperty = new Property({
            seller: req.user.id, // Comes from your auth middleware
            title,
            description,
            price: Number(price),
            location,
            address,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            area: Number(area),
            propertyType,
            amenities,
            images: imageUrls, // Save the Cloudinary URLs
        });

        // 5. Save the property to the database
        const savedProperty = await newProperty.save();

        res.status(201).json(savedProperty);

    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ message: 'Server error while creating property.' });
    }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (property) {
        if (property.seller.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this property');
        }

        // Update all fields from req.body
        Object.assign(property, req.body);

        const updatedProperty = await property.save();
        res.json(updatedProperty);
    } else {
        res.status(404);
        throw new Error('Property not found');
    }
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (property) {
        if (property.seller.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this property');
        }

        await property.deleteOne(); // use deleteOne instead of remove
        res.json({ message: 'Property removed' });
    } else {
        res.status(404);
        throw new Error('Property not found');
    }
});

const getMyProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find({ seller: req.user._id });
    res.json(properties);
});

// @desc    Place a bid on a property
// @route   POST /api/properties/:id/bid
// @access  Private
const placeBid = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    // Check if user is trying to bid on their own property
    if (property.seller.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot bid on your own property');
    }

    // Validate bid amount
    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error('Please provide a valid bid amount');
    }

    // Check if bid meets minimum requirement
    if (amount < property.minimumBid) {
        res.status(400);
        throw new Error(`Bid must be at least $${property.minimumBid}`);
    }

    // Add bid to property
    const bid = {
        bidder: req.user._id,
        amount: Number(amount),
        createdAt: new Date()
    };

    property.bids.push(bid);
    await property.save();

    // Populate the bidder info before sending response
    const updatedProperty = await Property.findById(property._id)
        .populate('bids.bidder', 'username email profilePicture');

    res.status(201).json({
        message: 'Bid placed successfully',
        bids: updatedProperty.bids
    });
});

// @desc    Get all bids for a property
// @route   GET /api/properties/:id/bids
// @access  Public
const getPropertyBids = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id)
        .populate('bids.bidder', 'username email profilePicture')
        .select('bids minimumBid');

    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    // Sort bids by amount (highest first)
    const sortedBids = property.bids.sort((a, b) => b.amount - a.amount);

    res.json({
        bids: sortedBids,
        minimumBid: property.minimumBid,
        highestBid: sortedBids.length > 0 ? sortedBids[0].amount : 0
    });
});

// @desc    Get property appointments (for showing booked dates/times)
// @route   GET /api/properties/:id/appointments
// @access  Public
const getPropertyAppointments = asyncHandler(async (req, res) => {
    const Appointment = (await import('../models/Appointment.js')).default;
    
    const appointments = await Appointment.find({
        property: req.params.id,
        status: { $in: ['pending', 'confirmed'] } // Only show active appointments
    })
    .select('appointmentDate appointmentTime status buyer bidAmount')
    .populate('buyer', 'username')
    .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json(appointments);
});

export { 
    getProperties, 
    getPropertyById, 
    createProperty, 
    updateProperty, 
    deleteProperty, 
    getMyProperties,
    placeBid,
    getPropertyBids,
    getPropertyAppointments
};
import asyncHandler from 'express-async-handler';
import Property from '../models/Property.js';

// @desc    Fetch all properties with filtering
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
    const { keyword, location, propertyType, minPrice, maxPrice, bedrooms, bathrooms } = req.query;

    const query = {};

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
const createProperty = asyncHandler(async (req, res) => {
    // You'll get all data from req.body
    const property = new Property({
        ...req.body,
        seller: req.user._id, // from protect middleware
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
});

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

export { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getMyProperties};
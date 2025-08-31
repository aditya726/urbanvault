import asyncHandler from 'express-async-handler';
import Property from '../models/Property.js';

// @desc    Fetch all properties with filtering
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword ? {
        title: {
            $regex: req.query.keyword,
            $options: 'i', // case-insensitive
        },
    } : {};

    const properties = await Property.find({ ...keyword }).populate('seller', 'username email');
    res.json(properties);
});

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id).populate('seller', 'username email profilePicture');

    if (property) {
        res.json(property);
    } else {
        res.status(404);
        throw new Error('Property not found');
    }
});

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Seller
const createProperty = asyncHandler(async (req, res) => {
    const { title, description, price, location, address, bedrooms, bathrooms, area, propertyType, amenities, images } = req.body;

    const property = new Property({
        seller: req.user._id, // from protect middleware
        title,
        description,
        price,
        location,
        address,
        bedrooms,
        bathrooms,
        area,
        propertyType,
        amenities,
        images
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Seller
const updateProperty = asyncHandler(async (req, res) => {
    const { title, description, price, location, address, bedrooms, bathrooms, area, propertyType, amenities, images, status } = req.body;

    const property = await Property.findById(req.params.id);

    if (property) {
        // Check if the logged-in user is the owner of the property
        if (property.seller.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this property');
        }

        property.title = title || property.title;
        property.description = description || property.description;
        property.price = price || property.price;
        property.location = location || property.location;
        // ... update other fields as needed
        property.status = status || property.status;

        const updatedProperty = await property.save();
        res.json(updatedProperty);

    } else {
        res.status(404);
        throw new Error('Property not found');
    }
});


// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Seller
const deleteProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (property) {
        // Check if the logged-in user is the owner
        if (property.seller.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this property');
        }

        await property.remove();
        res.json({ message: 'Property removed' });
    } else {
        res.status(404);
        throw new Error('Property not found');
    }
});


export { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty };
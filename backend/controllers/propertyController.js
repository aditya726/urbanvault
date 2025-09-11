import asyncHandler from 'express-async-handler';
import Property from '../models/Property.js';

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

export { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getMyProperties};
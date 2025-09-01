import mongoose from "mongoose";
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    area: {
        type: Number, // in square feet or meters
        required: true
    },
    propertyType: {
        type: String,
        enum: ['Apartment', 'House', 'Villa', 'Commercial', 'Land'],
        required: true
    },
    amenities: [String], // e.g., ['pool', 'gym', 'parking']
    images: [{
        type: String, // Array of URLs to images
        required: true
    }],
    status: {
        type: String,
        enum: ['available', 'sold', 'pending'],
        default: 'available'
    }
}, {
    timestamps: true
});

const Property = mongoose.model('Property', propertySchema);

export default Property;

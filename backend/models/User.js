import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        required: true
    },
    // Seller-specific fields
    totalSales: {
        type: Number,
        default: 0
    },
    // We will calculate average rating from the Review model
    // but can store a cached version here for performance if needed.
    averageRating: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String, // URL to the image
        default: 'https://placehold.co/150x150/EFEFEF/AAAAAA?text=No+Image'
    },
    phoneNumber: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// A pre-save hook for password hashing can be added here later using bcrypt

const User = mongoose.model('User', userSchema);

module.exports = User;
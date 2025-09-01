import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = mongoose.Schema({
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
        validate: [validator.isEmail, 'Please provide a valid email address']
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
    totalSales: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String,
        default: 'https://placehold.co/150x150/EFEFEF/AAAAAA?text=No+Image'
    },
    phoneNumber: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
});

// Method to compare entered password with the hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving the user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // FIXED: Added await
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
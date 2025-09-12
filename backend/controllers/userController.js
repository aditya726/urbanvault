import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;

    const userExists = await User.findOne({ $or: [{email}, {username}] });

    if (userExists) {
        res.status(400);
        throw new Error('User with this email or username already exists');
    }

    const user = await User.create({
        username,
        email,
        password,
        phoneNumber
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            wishlist: user.wishlist,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const getMyUserProfile = asyncHandler(async (req, res) => {
    // req.user is added by the 'protect' middleware
    const user = await User.findById(req.user._id).select('-password'); 
    
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});



// @desc    Add property to user's wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const { propertyId } = req.body;
    const user = await User.findById(req.user._id);

    if (user && propertyId) {
        if (user.wishlist.includes(propertyId)) {
            // It's already there, so let's remove it
            user.wishlist = user.wishlist.filter((id) => id.toString() !== propertyId);
            await user.save();
            res.json({ message: 'Property removed from wishlist', wishlist: user.wishlist });
        } else {
             // Add it
            user.wishlist.push(propertyId);
            await user.save();
            res.status(201).json({ message: 'Property added to wishlist', wishlist: user.wishlist });
        }
    } else {
        res.status(404);
        throw new Error('User or Property not found');
    }
});


// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'wishlist',
        populate: {
            path: 'seller',
            select: 'username'
        }
    });
    
    if (user) {
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { registerUser, loginUser, getUserProfile, addToWishlist, getWishlist,getMyUserProfile };
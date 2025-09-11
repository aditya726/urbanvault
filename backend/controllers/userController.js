import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;

    const userExistsConditions = [{ email }];
    if (phoneNumber) {
        userExistsConditions.push({ phoneNumber });
    }

    const userExists = await User.findOne({ $or: userExistsConditions });

    if (userExists) {
        res.status(400);
        if (userExists.email === email) {
            throw new Error('A user with this email already exists');
        }
        if (phoneNumber && userExists.phoneNumber === phoneNumber) {
            throw new Error('A user with this phone number already exists');
        }
    }

    const user = new User({
        username,
        email,
        password,
        phoneNumber
    });

    await user.save();

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

export { registerUser, loginUser, getUserProfile };
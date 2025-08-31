import express from 'express';
const router = express.Router();

// @route   POST api/users/register
// @desc    Register a new user (buyer or seller)
// @access  Public
router.post('/register', (req, res) => {
    res.json({ message: 'User registration endpoint' });
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', (req, res) => {
    res.json({ message: 'User login endpoint' });
});

// @route   GET api/users/:id
// @desc    Get user profile (especially for seller profiles)
// @access  Public
router.get('/:id', (req, res) => {
    res.json({ message: `Get profile for user ${req.params.id}` });
});

export default router;


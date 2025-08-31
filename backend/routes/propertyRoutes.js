import express from 'express';
const router = express.Router();

// @route   GET api/properties
// @desc    Get all properties with filtering options
// @access  Public
router.get('/', (req, res) => {
    res.json({ message: 'Get all properties with filters', filters: req.query });
});

// @route   POST api/properties
// @desc    Create a new property listing
// @access  Private (Seller only)
router.post('/', (req, res) => {
    res.json({ message: 'Create a new property' });
});

// @route   GET api/properties/:id
// @desc    Get a single property by ID
// @access  Public
router.get('/:id', (req, res) => {
    res.json({ message: `Get property with ID ${req.params.id}` });
});

export default router;


import express from 'express';
const router = express.Router();
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties // Import the new function
} from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Private seller routes
router.get('/my-listings', protect, getMyProperties); // Add this new route
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);


export default router;
import express from 'express';
const router = express.Router();
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties
} from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';


// --- FIX: Specific routes must be defined before dynamic routes ---
// Private seller route for getting user-specific listings
router.get('/my-listings', protect, getMyProperties); 

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById); // This will now correctly handle property IDs

// Private seller routes for managing properties
router.route('/')
    .post(protect, upload.array('images', 5), createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);


export default router;

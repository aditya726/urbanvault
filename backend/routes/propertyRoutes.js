import express from 'express';
const router = express.Router();
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties,
    placeBid,
    getPropertyBids,
    getPropertyAppointments
} from '../controllers/propertyController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';


// --- FIX: Specific routes must be defined before dynamic routes ---
// Private seller route for getting user-specific listings
router.get('/my-listings', protect, getMyProperties); 

// Public routes with optional authentication
router.get('/', optionalAuth, getProperties);
router.get('/:id', getPropertyById); // This will now correctly handle property IDs

// Bidding routes
router.post('/:id/bid', protect, placeBid);
router.get('/:id/bids', getPropertyBids);

// Appointments route for property
router.get('/:id/appointments', getPropertyAppointments);

// Private seller routes for managing properties
router.route('/')
    .post(protect, upload.array('images', 5), createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);


export default router;

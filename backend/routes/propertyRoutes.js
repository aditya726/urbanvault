import express from 'express';
const router = express.Router();
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
} from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Private seller routes - 'seller' middleware is removed
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);


export default router;
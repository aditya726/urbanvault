import express from 'express';
const router = express.Router();
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
} from '../controllers/propertyController.js';
import { protect, seller } from '../middleware/authMiddleware.js';

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Private seller routes
router.post('/', protect, seller, createProperty);
router.put('/:id', protect, seller, updateProperty);
router.delete('/:id', protect, seller, deleteProperty);


export default router;
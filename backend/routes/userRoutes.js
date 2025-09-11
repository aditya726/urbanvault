import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    getUserProfile,
    addToWishlist,
    getWishlist
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);

// Wishlist routes
router.route('/wishlist')
    .get(protect, getWishlist)
    .post(protect, addToWishlist); // Merged add/remove logic

router.get('/:id', getUserProfile);

export default router;
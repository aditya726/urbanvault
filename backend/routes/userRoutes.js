import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    getUserProfile,
    addToWishlist,
    getWishlist,
    getMyUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
//protected route to get logged in user's profile
router.get('/profile',protect, getMyUserProfile);

// Wishlist routes
router.route('/wishlist')
    .get(protect, getWishlist)
    .post(protect, addToWishlist); // Merged add/remove logic

// Public route to get user profile by ID
router.get('/:id', getUserProfile);

export default router;
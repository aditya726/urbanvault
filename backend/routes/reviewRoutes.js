import express from 'express';
const router = express.Router();
import { createReview, getReviewsForSeller } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createReview);
router.route('/seller/:sellerId').get(getReviewsForSeller);

export default router;
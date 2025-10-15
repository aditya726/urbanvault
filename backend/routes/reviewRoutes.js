import express from 'express';
const router = express.Router();
import { createReview, getReviewsForSeller, getReviewsForProperty } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createReview);
router.route('/seller/:sellerId').get(getReviewsForSeller);
router.route('/property/:propertyId').get(getReviewsForProperty);

export default router;
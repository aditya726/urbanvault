import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import User from '../models/User.js';

// @desc    Create a new review for a seller
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { sellerId, rating, comment } = req.body;

    const review = new Review({
        seller: sellerId,
        buyer: req.user._id,
        rating,
        comment,
    });

    await review.save();

    // Update the seller's average rating
    const reviews = await Review.find({ seller: sellerId });
    const user = await User.findById(sellerId);

    if (user) {
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        user.averageRating = (totalRating / reviews.length).toFixed(1);
        user.totalSales = reviews.length;
        await user.save();
    }

    res.status(201).json({ message: 'Review added' });
});

// @desc    Get all reviews for a specific seller
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
const getReviewsForSeller = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ seller: req.params.sellerId })
        .populate('buyer', 'username profilePicture')
        .sort({ createdAt: -1 });
    res.json(reviews);
});

export { createReview, getReviewsForSeller };
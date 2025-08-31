import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// You can add a static method here to calculate the average rating for a seller
// and update the User model whenever a new review is added.

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

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
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
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
    },
    reviewType: {
        type: String,
        enum: ['seller', 'property', 'both'],
        default: 'both'
    }
}, {
    timestamps: true
});

// You can add a static method here to calculate the average rating for a seller
// and update the User model whenever a new review is added.

const Review = mongoose.model('Review', reviewSchema);

export default Review;

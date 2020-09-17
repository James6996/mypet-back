const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userRatingSchema = new Schema(
  {
    reviewerId: { type: mongoose.Types.ObjectId, ref: 'User' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
)

const UserRating = model('UserRating', userRatingSchema)

module.exports = UserRating

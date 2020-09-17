const mongoose = require('mongoose')

const { Schema, model } = mongoose

const shopRatingSchema = new Schema(
  {
    category: {
      type: String,
      enum: ['pet toys', 'veterinary', 'pet sitting', 'adoption center'],
    },

    rating: { type: Number, required: true, min: 0, max: 5 },
    shopId: { type: mongoose.Types.ObjectId, ref: 'Shop' },
    reviewerId: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const ShopRating = model('ShopRating', shopRatingSchema)

module.exports = ShopRating

const mongoose = require('mongoose')
const ShopRating = require('./ShopRating')

const { Schema, model } = mongoose

const shopsSchema = new Schema({
  picture: { type: String },
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['pet toys', 'veterinary', 'pet sitting', 'adoption center'],
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: { type: [Number], default: [0, 0] },
  },
  contact: { type: String },
  rating: [{ type: mongoose.Types.ObjectId, ref: ShopRating }],
})

shopsSchema.index({ location: '2dsphere' })

const Shop = model('Shops', shopsSchema)
module.exports = Shop

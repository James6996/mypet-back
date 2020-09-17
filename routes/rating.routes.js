const router = require('express').Router()

const ShopRating = require('../models/ShopRating')
const UserRating = require('../models/UserRating')
const User = require('../models/User')
const Shop = require('../models/Shop')

// POST a rating to a shop
router.post('/shop', async (req, res, next) => {
  try {
    const { _id: reviewerId } = req.user
    const { shopId, rating } = req.body

    const newRating = new ShopRating({
      reviewerId,
      shopId,
      rating,
    })

    await Shop.findByIdAndUpdate(shopId, { $push: { rating: newRating } })

    await newRating.save().then(() => {
      res.status(200).json({ data: { message: 'Revew Submitted', newRating } })
    })
  } catch (err) {
    return next(err)
  }
})

// POST a rating to another user
router.post('/user', async (req, res, next) => {
  try {
    const { _id: reviewerId } = req.user
    const { userId, rating } = req.body

    const newRating = new UserRating({
      reviewerId,
      userId,
      rating,
    })

    await User.findByIdAndUpdate(userId, { $push: { rating: newRating } })

    await newRating.save().then(() => {
      res.status(200).json({ data: { message: 'Revew Submitted', newRating } })
    })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

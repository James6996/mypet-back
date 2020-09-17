const router = require('express').Router()

const Shop = require('../models/Shop')

// VIEW SHOPS NEAR USER
router.get('/near-me', async (req, res, next) => {
  try {
    const { longitude, latitude, distance } = req.query

    const placesByLocation = await Shop.find({
      location: {
        $near: {
          $maxDistance: distance,
          $geometry: {
            type: 'Point',
            coordinates: [latitude, longitude],
          },
        },
      },
    })

    res.status(200).json({ data: placesByLocation })
  } catch (error) {
    return next(error)
  }
})
// VIEW ALL SHOPS
router.get('/all', async (req, res, next) => {
  try {
    const allShops = await Shop.find()
    return res.status(200).json({ data: allShops })
  } catch (error) {
    return next(error)
  }
})

module.exports = router

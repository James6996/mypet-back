const express = require('express')

const meanBy = require('lodash/meanBy')

const User = require('../models/User')

const router = express.Router()

// VIEW ALL CARETAKERS -- NO LOGIN REQUIRED
router.get('/caretakers', async (req, res, next) => {
  try {
    const { longitude, latitude, distance, service } = req.query

    const allCareTakers = await User.find({
      role: 'caretaker',
      booked: false,
      ...(service ? { services: service } : {}), // service query is optional
      location: {
        $near: {
          $maxDistance: distance,
          $geometry: {
            type: 'Point',
            coordinates: [latitude, longitude],
          },
        },
      },
    }).populate('rating')

    // This shows the avg rating from the user, thanks to lodash's meanBy
    const caretakersWithAvg = allCareTakers.map((caretaker) => {
      const avgRating = meanBy(caretaker.rating, (rate) => rate.rating)
      return { ...caretaker.toObject(), avgRating }
    })
    return res
      .status(200)
      .json({ data: { message: 'These are all the caretakers', caretakers: caretakersWithAvg } })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

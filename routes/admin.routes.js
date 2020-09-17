const router = require('express').Router()
const pickBy = require('lodash/pickBy')

const Blog = require('../models/Blog')
const Shop = require('../models/Shop')
const Pet = require('../models/Pet')

// Add new shop
router.post('/new-shop', async (req, res, next) => {
  try {
    const { longitude, latitude } = req.body
    const newShop = new Shop({
      name: req.body.name,
      category: req.body.category,
      location: { coordinates: [longitude, latitude] },
      contact: req.body.contact,
    })

    await newShop
      .save()
      .then(() => res.status(200).json({ data: { message: 'New Shop Added', newShop } }))
  } catch (err) {
    next(err)
  }
})

// Edit Shop
router.put('/edit/:shopId', async (req, res, next) => {
  try {
    const { shopId } = req.params
    const { longitude, latitude } = req.body

    const newFields = {
      name: req.body.name,
      category: req.body.category,
      location: { coordinates: [longitude, latitude] },
      contact: req.body.contact,
    }

    const cleanShop = pickBy(newFields, (value) => !!value)

    const editedShop = await Shop.findByIdAndUpdate(shopId, cleanShop, { new: true })

    return res.status(200).json({ data: { message: 'Shop Edited Successfully', editedShop } })
  } catch (err) {
    next(err)
  }
})

// Delete Shop
router.delete('/delete-shop/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    await Shop.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Shop deleted successfully' })
  } catch (err) {
    next(err)
  }
})

// Delete Blog Article
router.delete('/delete-post/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    await Blog.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Post deleted successfully' })
  } catch (err) {
    next(err)
  }
})

// Get all pet
router.get('/all-pets', async (req, res) => {
  try {
    const pets = await Pet.find()
    return res.status(200).json({ data: pets })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

module.exports = router

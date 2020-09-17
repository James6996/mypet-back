const express = require('express')

const Blog = require('../models/Blog')

const router = express.Router()

// Get all blog articles
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
    return res.status(200).json({ data: blogs })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

module.exports = router

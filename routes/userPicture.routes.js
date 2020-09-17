const router = require('express').Router()

const User = require('../models/User')

const { isAuthenticated } = require('../middlewares/auth.middleware')
const { upload, uploadToCloudinary } = require('../middlewares/file.middleware')

router.put(
  '/:id',
  [upload.single('picture'), uploadToCloudinary],
  [isAuthenticated],
  async (req, res, next) => {
    try {
      const userId = req.params.id
      const newFields = {
        picture: req.file ? req.file.filePath : null,
      }

      // eslint-disable-next-line no-shadow
      const cleanUser = Object.keys(newFields).reduce((acc, next) => {
        if (newFields[next]) {
          return {
            ...acc,
            [next]: newFields[next],
          }
        }
        return acc
      }, {})

      const updatedUser = await User.findByIdAndUpdate(userId, cleanUser, {
        new: true,
      })

      return res.status(200).json({ data: updatedUser })
    } catch (err) {
      return next(err)
    }
  }
)

module.exports = router

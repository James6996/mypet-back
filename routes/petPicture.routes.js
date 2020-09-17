const router = require('express').Router()

const Pet = require('../models/Pet')

const { isAuthenticated } = require('../middlewares/auth.middleware')
const { upload, uploadToCloudinary } = require('../middlewares/file.middleware')

router.put(
  '/:id',
  [upload.single('picture'), uploadToCloudinary],
  [isAuthenticated],
  async (req, res, next) => {
    try {
      const petId = req.params.id
      const newFields = {
        picture: req.file ? req.file.filePath : null,
      }

      // eslint-disable-next-line no-shadow
      const cleanPet = Object.keys(newFields).reduce((acc, next) => {
        if (newFields[next]) {
          return {
            ...acc,
            [next]: newFields[next],
          }
        }
        return acc
      }, {})

      const updatedPet = await Pet.findByIdAndUpdate(petId, cleanPet, {
        new: true,
      })

      return res.status(200).json({ data: updatedPet })
    } catch (err) {
      return next(err)
    }
  }
)

module.exports = router

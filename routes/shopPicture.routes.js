const router = require('express').Router()

const Shop = require('../models/Shop')

const { upload, uploadToCloudinary } = require('../middlewares/file.middleware')

router.put('/:id', [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
  try {
    const shopId = req.params.id
    const newFields = {
      picture: req.file ? req.file.filePath : null,
    }

    // eslint-disable-next-line no-shadow
    const cleanShop = Object.keys(newFields).reduce((acc, next) => {
      if (newFields[next]) {
        return {
          ...acc,
          [next]: newFields[next],
        }
      }
      return acc
    }, {})

    const updatedShop = await Shop.findByIdAndUpdate(shopId, cleanShop, {
      new: true,
    })

    return res.status(200).json({ data: updatedShop })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

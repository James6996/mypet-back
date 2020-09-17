const router = require('express').Router()

const Blog = require('../models/Blog')

const { isAuthenticated } = require('../middlewares/auth.middleware')
const { upload, uploadToCloudinary } = require('../middlewares/file.middleware')

router.put(
  '/:id',
  [upload.single('picture'), uploadToCloudinary],
  [isAuthenticated],
  async (req, res, next) => {
    try {
      const articleId = req.params.id
      const newFields = {
        picture: req.file ? req.file.filePath : null,
      }

      // eslint-disable-next-line no-shadow
      const cleanArticle = Object.keys(newFields).reduce((acc, next) => {
        if (newFields[next]) {
          return {
            ...acc,
            [next]: newFields[next],
          }
        }
        return acc
      }, {})

      const updatedArticle = await Blog.findByIdAndUpdate(articleId, cleanArticle, {
        new: true,
      })

      return res.status(200).json({ data: updatedArticle })
    } catch (err) {
      return next(err)
    }
  }
)

module.exports = router

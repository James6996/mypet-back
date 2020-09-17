require('dotenv').config()

const { APP_EMAIL, APP_PASS } = process.env

const nodemailer = require('nodemailer')

const router = require('express').Router()

const Pet = require('../models/Pet')
const User = require('../models/User')
const Blog = require('../models/Blog')

const { isAuthenticated, isBasicRole, isCareTakerRole } = require('../middlewares/auth.middleware')
const { upload, uploadToCloudinary } = require('../middlewares/file.middleware')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: APP_EMAIL,
    pass: APP_PASS,
  },
})

// VIEW PROFILE
router.get('/my-profile', [isAuthenticated], async (req, res, next) => {
  try {
    const { _id: userId } = req.user

    const user = await User.findById(userId)
    return res.status(200).json({
      data: { message: 'Your profile', allData: user },
    })
  } catch (error) {
    return next(error)
  }
})

// EDIT PROFILE
router.put('/edit-profile', [isAuthenticated], async (req, res, next) => {
  try {
    const { _id: userId } = req.user
    const newFields = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }

    // eslint-disable-next-line no-shadow
    const cleanProfile = Object.keys(newFields).reduce((acc, next) => {
      if (newFields[next]) {
        return {
          ...acc,
          [next]: newFields[next],
        }
      }
      return acc
    }, {})

    const updatedProfile = await User.findByIdAndUpdate(userId, cleanProfile, {
      new: true,
    })

    return res.status(200).json({ data: updatedProfile })
  } catch (err) {
    return next(err)
  }
})

// VIEW MY PETS
// TODO QUIZAS MOVER DE RUTA A PETS
router.get('/my-pets', [isAuthenticated], async (req, res, next) => {
  try {
    // console.log(req.user)
    const { _id: userId } = req.user

    const pets = await User.findById(userId).populate('pets')
    return res.status(200).json({
      data: { message: 'These are your pets', allPets: pets.pets },
    })
  } catch (error) {
    return next(error)
  }
})

// ADD NEW PET
// TODO QUIZAS MOVER DE RUTA A PETS
router.post('/add-pet', async (req, res, next) => {
  try {
    const { _id: userId } = req.user
    // const { petId } = req.user

    const newPet = new Pet({
      userId,
      name: req.body.name,
      age: req.body.age,
      type: req.body.type,
      race: req.body.race,
      gender: req.body.gender,
      description: req.body.info,
    })
    const savedPet = await newPet.save()
    console.log('Saved pet', savedPet)
    const userPet = await User.findByIdAndUpdate(
      userId,
      { $push: { pets: savedPet._id } },
      { new: true }
    ).populate('pets')
    console.log('UserPet', userPet)
    res.status(200).json({ data: { message: 'New Pet Added', pet: savedPet, userPets: userPet } })

    // const userPet = await User.findByIdAndUpdate(userId, { $push: { pets: newPet } }, { new: true })

    // await newPet.save().then(() => {
    //   res.status(200).json({ data: { message: 'New Pet Added', pet: newPet, userPets: userPet } })
    //  })
  } catch (err) {
    console.log(err)
    console.log(err.message)
    next(err)
  }
})

// EDIT A PET
// TODO QUIZAS MOVER DE RUTA A PETS
router.put('/modify-pet/:id', [isAuthenticated], async (req, res, next) => {
  try {
    const petId = req.params.id
    const newFields = {
      name: req.body.name,
      age: req.body.age,
      type: req.body.type,
      race: req.body.race,
      gender: req.body.gender,
      description: req.body.info,
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
})

// REMOVE A PET
// TODO QUIZAS MOVER DE RUTA A PETS
router.delete('/delete-pet/:id', [isAuthenticated], async (req, res, next) => {
  const petId = req.params.id
  const userId = req.user.id
  try {
    const deletedPet = await Pet.findByIdAndDelete(petId)
    const updatedUser = await User.findById(userId)
    return res.status(200).json({ data: { delPet: { deletedPet }, user: { updatedUser } } })
  } catch (err) {
    return next(err)
  }
})

// USER - VIEW MY ARTICLES
router.get('/my-articles', [isAuthenticated], async (req, res, next) => {
  try {
    const { _id: userId } = req.user

    const articles = await User.findById(userId).populate('blogs')
    return res.status(200).json({
      data: { message: 'These are your articles', articles: articles.blogs },
    })
  } catch (err) {
    return next(err)
  }
})

// USER - POST A NEW ARTICLE
router.post(
  '/add-article',
  [upload.single('picture'), uploadToCloudinary],
  [isAuthenticated],
  async (req, res, next) => {
    try {
      const { _id: userId } = req.user

      const newBlog = new Blog({
        userId,
        picture: req.file ? req.file.filePath : null,
        title: req.body.title,
        description: req.body.description,
      })

      const userBlog = await User.findByIdAndUpdate(
        userId,
        { $push: { blogs: newBlog } },
        { new: true }
      )

      await newBlog.save().then(() => {
        res
          .status(200)
          .json({ data: { message: 'New Article Added', blog: newBlog, userBlogs: userBlog } })
      })
    } catch (err) {
      return next(err)
    }
  }
)

// USER - EDIT MY ARTICLES
router.put(
  '/edit-article/:id',
  [upload.single('picture'), uploadToCloudinary],
  [isAuthenticated],
  async (req, res, next) => {
    try {
      const articleId = req.params.id
      const newFields = {
        picture: req.file ? req.file.filePath : null,
        title: req.body.title,
        description: req.body.description,
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

      return res
        .status(200)
        .json({ data: { message: 'Articulo editado exitosamente', updatedArticle } })
    } catch (err) {
      return next(err)
    }
  }
)

// USER - DELETE MY ARTICLES
router.delete('/delete-article/:id', [isAuthenticated], async (req, res, next) => {
  const articleId = req.params.id
  try {
    await Blog.findByIdAndDelete(articleId)
    return res.status(200).json({ data: 'Blog article deleted successfully' })
  } catch (err) {
    return next(err)
  }
})

// BOOK A CARETAKER
router.put('/book', [isBasicRole], async (req, res, next) => {
  try {
    const { email } = req.user
    const { caretakerId } = req.body
    const caretaker = await User.findById(caretakerId)

    console.log(email)
    console.log(caretakerId)
    console.log(caretaker)

    if (caretaker.role !== 'caretaker') {
      return res.status(200).json({ data: 'Lo sentimos, este usuario yno puede ser reservado' })
    }

    // If trying to booked an already booked user, returns error message.
    if (caretaker.booked === true) {
      return res
        .status(200)
        .json({ data: 'Lo sentimos, este usuario ya ha sido reservado por alguien' })
    }

    const updateBook = {
      booked: true,
      bookedBy: req.user._id,
    }
    const modifyBook = await User.findByIdAndUpdate(caretakerId, updateBook, {
      new: true,
    })

    // nodemailer options and email sending.
    const mailOptions = {
      from: APP_EMAIL,
      to: email,
      bcc: modifyBook, // a copy of the booking email should be sent to the carteaker's email address
      subject: 'Tu Nueva Reserva',
      text: `Hola ${req.user.username}! Has reservado un nuevo servicio con ${modifyBook.username}`,
      replyTo: APP_EMAIL,
    }
    transporter.sendMail(mailOptions, (err, resp) => {
      if (err) {
        console.log(err.message)
      } else {
        console.log(`Email sent to ${req.body.email}`, resp)
      }
    })
    return res.status(200).json({ data: modifyBook })
  } catch (err) {
    return next(err)
  }
})

// CARETAKER CANCEL THEIR BOOKINGS
router.put('/cancel-booking', [isCareTakerRole], async (req, res, next) => {
  try {
    const { _id: careTakerId } = req.user
    const user = await User.findById(careTakerId).populate('bookedBy')

    if (user.booked === false) {
      return res.status(200).json({ data: 'Ya no tienes ninguna reserva!!' })
    }

    const cancelBook = {
      booked: false,
      bookedBy: null,
    }
    const freeBook = await User.findByIdAndUpdate(careTakerId, cancelBook, {
      new: true,
    })
    const { email, username } = user.bookedBy
    const mailOptions = {
      from: APP_EMAIL,
      to: email,
      subject: 'Reserva Cancelada',
      text: `Hola ${username}, lamentamos notificarte que ${req.user.username} ha tenido que cancelar tu reserva.`,
      replyTo: APP_EMAIL,
    }
    transporter.sendMail(mailOptions, (err, resp) => {
      if (err) {
        console.log(err.message)
      } else {
        console.log(`Email sent to ${req.body.email}`, resp)
      }
    })
    return res
      .status(200)
      .json({ data: { message: 'You have successfully cancelled your booking', freeBook } })
  } catch (err) {
    return next(err)
  }
})

// CARETAKERS CAN VIEW WHO BOOKED THEM
router.get('/my-bookings', [isCareTakerRole], async (req, res, next) => {
  try {
    const bookedUser = await User.findById(req.user.bookedBy).populate('bookedBy')
    return res.status(200).json({ data: bookedUser })
  } catch (err) {
    return next(err)
  }
})

// SUSCRIBE AS CARETAKER -- EDIT ROLES FROM BASIC TO CARETAKER
router.put('/caretaker-register', [isBasicRole], async (req, res, next) => {
  try {
    const { _id: basicId } = req.user
    const updateRole = {
      role: 'caretaker',
    }
    const modifyRole = await User.findByIdAndUpdate(basicId, updateRole, {
      new: true,
    })
    return res.status(200).json({ data: modifyRole })
  } catch (err) {
    return next(err)
  }
})

// UNSUSCRIBE FROM BEING A CARETAKER -- EDIT ROLES FROM CARETAKER TO BASIC
router.put('/caretaker-unsuscribe', [isCareTakerRole], async (req, res, next) => {
  try {
    const { _id: careTakerId } = req.user
    const updateRole = {
      role: 'basic',
    }
    const modifyRole = await User.findByIdAndUpdate(careTakerId, updateRole, {
      new: true,
    })
    return res.status(200).json({ data: modifyRole })
  } catch (err) {
    return next(err)
  }
})

// CARETAKERS EDIT THEIR AVAILABLE SERVICES
router.put('/edit/services', [isCareTakerRole], async (req, res, next) => {
  try {
    const { _id: careTakerId } = req.user
    const { newService } = req.body
    const editServices = await User.findByIdAndUpdate(
      careTakerId,
      { $push: { services: newService } },
      { new: true }
    )
    console.log(editServices)
    return res.status(200).json({ data: editServices })
  } catch (err) {
    return next(err)
  }
})

// Remove Service
router.put('/edit/remove-service', [isCareTakerRole], async (req, res, next) => {
  try {
    const { _id: careTakerId } = req.user
    const { serviceToRemove } = req.body
    const userToRemoveService = await User.findById(careTakerId)
    console.log(userToRemoveService.services)
    if (userToRemoveService.services.includes(serviceToRemove)) {
      const removedService = await User.findByIdAndUpdate(
        careTakerId,
        { $pull: { services: serviceToRemove } },
        { new: true }
      )

      return res.status(200).json({ data: removedService })
    }
  } catch (err) {
    next(err)
  }
})

// CARETAKERS UPDATE THEIR LOCATION
router.put('/update-location', [isAuthenticated, isCareTakerRole], async (req, res, next) => {
  try {
    const { longitude, latitude } = req.body // Averiguar como puede ser esto desde el front.
    const newLocation = [longitude, latitude]
    const { _id: userId } = req.user

    const updatedLocation = await User.findByIdAndUpdate(
      userId,
      { $set: { 'location.coordinates': newLocation } },
      { new: true }
    )
    return res.status(200).json({
      data: {
        message: 'Location updated successfully',
        newLocation: updatedLocation,
      },
    })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

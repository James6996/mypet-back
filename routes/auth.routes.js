require('dotenv').config()

const { APP_EMAIL, APP_PASS } = process.env

const express = require('express')
const passport = require('passport')
const nodemailer = require('nodemailer')

const router = express.Router()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: APP_EMAIL,
    pass: APP_PASS,
  },
})

router.get('/check-session', (req, res, next) => {
  if (req.user) {
    return res.status(200).json({ data: req.user })
  } else {
    const err = new Error('No user session found!')
    err.code = 401
    return next(err)
  }
})

router.post('/register', (req, res, next) => {
  // Aquí usamos passport para registrar usuarios
  passport.authenticate('register', (error, user) => {
    if (error) {
      return res.status(500).json({ message: error.message })
    } else {
      const mailOptions = {
        from: APP_EMAIL,
        to: `${req.body.email}`,
        subject: 'Bienvenid@ a My Pet',
        text: `Hola! ${req.body.username}, bienvenid@ a My Pet, estamos muy contentos de que formes parte de nuestra comunidad.`,
        replyTo: 'mypet.upgrade@gmail.com',
      }

      transporter.sendMail(mailOptions, (err, resp) => {
        if (err) {
          console.log(err.message)
        } else {
          console.log(`Email sent to ${req.body.email}`, resp)
        }
      })
      req.logIn(user, () => {
        return res.status(200).json({
          data: user,
        })
      })
    }
  })(req, res, next)
})

router.post('/login', (req, res, next) => {
  // Aquí usamos passport para hacer login con nuestros usuarios
  passport.authenticate('login', (error, user) => {
    if (error) {
      return res.status(500).json({ message: error.message })
    } else {
      // Usando el usuario del done() de passport 'login', creamos la sesión y logeamos
      req.logIn(user, () => {
        return res.status(200).json({
          data: user,
        })
      })
    }
  })(req, res, next)
})

// eslint-disable-next-line no-unused-vars
router.get('/logout', (req, res, next) => {
  if (req.user) {
    // Destruimos la sesión entre cliente/servidor
    req.logout()
    // Destruiremos la sesión y la cookie...
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: err.message })
      }

      // Destruimos la cookie del cliente en la respuesta
      res.clearCookie('connect.sid')

      return res.status(200).json({ data: 'Ok' })
    })
  } else {
    return res.status(200).json({ data: 'No session!' })
  }
})

module.exports = router

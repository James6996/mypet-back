const passport = require('passport')
// Importar la estrategia directamente sobre la variable LocalStrategy
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 12

const User = require('../models/User')

passport.use(
  'register',
  new LocalStrategy(
    {
      // Passport saca estos dos campos de req.body...
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    // email y password están en el callback porque passport los sacó del req.body
    async (req, email, password, done) => {
      try {
        // const { longitude, latitude } = req.body
        if (req.body.role && req.body.role !== 'basic') {
          const error = new Error('Invalid role')
          return done(error, null)
        }

        // Comprobamos que el email utilizado no existe en la base de datos
        const previousUser = await User.findOne({
          email: email.toLowerCase(),
        })

        // Si existe un usuario en la DB con ese mismo email, devolvemos un error al usuario
        if (previousUser) {
          const error = new Error('El email utilizado ya está en uso')
          return done(error, null)
        }

        // Comprobamos que la contraseña es válida y tiene 8 caracteres, mayúscula, minúscula y números...
        const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)

        if (!isValid) {
          const error = new Error(
            'La contraseña no es válida. Debe tener 8 caracteres, mayúsculas, minúsculas y números'
          )
          return done(error, null)
        }

        // Hacemos un hash con el password del usuario
        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashPassword,
          role: req.body.role || 'basic',
        })

        await newUser.save()

        // Si hay éxito guardando el usuario, llamo a done() sin error y con el usuario
        return done(null, newUser)
      } catch (err) {
        // Si el código falla, enviamos el error a través del callback a la ruta
        return done(err, null)
      }
    }
  )
)

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Buscamos un usuario por email en la DB
        const userByEmail = await User.findOne({
          email: email.toLowerCase(),
        })

        // Tendremos un error si un usuario que no existe se intenta logear
        if (!userByEmail) {
          const error = new Error('El email introducido no existe')
          return done(error, null)
        }

        // Comprobamos que el password enviado por el usuario coincide con el hash de la DB
        const isPasswordValid = await bcrypt.compare(password, userByEmail.password)

        // Si no coincide la contraseña, enviamos un error...
        if (!isPasswordValid) {
          const error = new Error('Combinación de email y contraseña incorrecta')
          return done(error, null)
        }

        // Si todo es válido, devolvemos el usuario  correctamente
        return done(null, userByEmail)
      } catch (err) {
        // Si el código falla, enviamos el error a través del callback a la ruta
        return done(err, null)
      }
    }
  )
)

// Middlewares para gestión de sesiones...

// Dado el usuario que passport gestiona, llamamos a done() con su _id para crear una sesión identificativa
passport.serializeUser((user, done) => {
  return done(null, user._id) // Esto va a la cookie de sesión
})

// Busca un usuario dada la id que está en la cookie de sesión y lo mete en req.user
passport.deserializeUser(async (userId, done) => {
  try {
    const dbUser = await User.findById(userId)
    done(null, dbUser)
  } catch (err) {
    done(err.message, null)
  }
})

// Exportamos passport para que se extienda globalmente la inicialización
module.exports = passport

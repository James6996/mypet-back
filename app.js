require('dotenv').config()

const { SECRET } = process.env

const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

require('./config/db')
const passport = require('./config/passport')

const shopPictureRoutes = require('./routes/shopPicture.routes')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const blogRoutes = require('./routes/blog.routes')
const userPictureRoutes = require('./routes/userPicture.routes')
const petPictureRoutes = require('./routes/petPicture.routes')
const blogPictureRoutes = require('./routes/blogPicture.routes')
const shopRoutes = require('./routes/shop.routes')
const ratingRouter = require('./routes/rating.routes')
const adminRouter = require('./routes/admin.routes')
const publicRouter = require('./routes/public.routes')

const { isAuthenticated, isAdminRole } = require('./middlewares/auth.middleware')

const errorMiddleware = require('./middlewares/error.middleware')
const loggerMiddleware = require('./middlewares/logger.middleware')

const server = express()

// Metemos un CORS básico para poder usar la API desde el frontend
server.use(cors({ origin: true, credentials: true }))

// Middlewares para interpretar un body en JSON
server.use(express.static(path.join(__dirname, 'public'))) // Añade soporte para estáticos a Express
server.use(express.json())
server.use(express.urlencoded({ extended: false }))

// Implementamos la gestión de sesiones
server.use(
  session({
    secret: SECRET,
    resave: true, // Solo guardará la sesión si hay cambios en ella.
    saveUninitialized: true, // Lo usaremos como false debido a que gestionamos nuestra sesión con Passport
    cookie: {
      maxAge: 3600000000000, // 1 h de sesion.
      secure: false,
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)
server.use(passport.initialize())
server.use(passport.session())
server.use(loggerMiddleware)

server.use('/api/auth', authRoutes)
server.use('/api/user', [isAuthenticated], userRoutes)
server.use('/api/shop/picture', [isAdminRole], shopPictureRoutes)
server.use('/api/user/picture', userPictureRoutes)
server.use('/api/pet/picture', petPictureRoutes)
server.use('/api/blog/picture', blogPictureRoutes)
server.use('/api/blog', blogRoutes) // public route -- all who visit can view
server.use('/api/shops', shopRoutes) // public route -- all who visit can view
server.use('/api/rating', [isAuthenticated], ratingRouter)
server.use('/api/admin', [isAdminRole], adminRouter)
server.use('/api/mypet', publicRouter) // public route -- all who visit can view

server.use(errorMiddleware)

const { PORT } = process.env
server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`)
})

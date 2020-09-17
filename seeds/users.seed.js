require('dotenv').config()

const { ADMIN_PASS } = process.env

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/User')

const SALT_ROUNDS = 10
const hashPass = bcrypt.hashSync('Prueba1234', SALT_ROUNDS)
const adminPass = bcrypt.hashSync(ADMIN_PASS, SALT_ROUNDS)
const myPass = bcrypt.hashSync('Gm050891', SALT_ROUNDS)

const usersSeed = [
  {
    picture: '',
    username: 'Jaime',
    email: 'jaime@mypet.com',
    password: hashPass,
    role: 'basic',
    location: {
      type: 'Point',
      coordinates: [40.45606, -3.699972],
    },
  },
  {
    picture: '',
    username: 'Gabriel',
    email: 'gabriel@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['walker', 'trainer'],
    booked: false,
    location: {
      type: 'Point',
      coordinates: [40.447314, -3.67953],
    },
  },
  {
    picture: '',
    username: 'Gabriel Madera',
    email: 'gabmadera@gmail.com',
    password: myPass,
    role: 'basic',
    location: {
      type: 'Point',
      coordinates: [40.447314, -3.67953],
    },
  },
  {
    picture: '',
    username: 'Rafa',
    email: 'rafa@mypet.com',
    password: hashPass,
    role: 'basic',
    location: {
      type: 'Point',
      coordinates: [40.438725, -3.709259],
    },
  },
  {
    picture: '',
    username: 'Juan',
    email: 'juan@juan.com',
    password: hashPass,
    role: 'basic',
    location: {
      type: 'Point',
      coordinates: [40.425773, -3.6801],
    },
  },
  {
    picture: '',
    username: 'Sara',
    email: 'sara@sara.com',
    password: hashPass,
    role: 'basic',
    location: {
      type: 'Point',
      coordinates: [40.404639, -3.703209],
    },
  },
  {
    picture: '',
    username: 'Ricky',
    email: 'rickimejia@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['walker', 'trainer'],
    location: {
      type: 'Point',
      coordinates: [40.401429, -3.703609],
    },
  },
  {
    picture: '',
    username: 'Rodolfo',
    email: 'rodocolmenares@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['walker', 'trainer'],
    location: {
      type: 'Point',
      coordinates: [40.404379, -3.793209],
    },
  },
  {
    picture: '',
    username: 'Valentina',
    email: 'valen@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['walker', 'trainer'],
    location: {
      type: 'Point',
      coordinates: [40.417639, -3.708709],
    },
  },
  {
    picture: '',
    username: 'May',
    email: 'may@mypet.com',
    password: hashPass,
    role: 'basic',
    location: {
      type: 'Point',
      coordinates: [40.324619, -3.754212],
    },
  },
  {
    picture: '',
    username: 'Juan',
    email: 'apurex@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['walker', 'trainer', 'sitter'],
    location: {
      type: 'Point',
      coordinates: [40.407639, -3.702209],
    },
  },
  {
    picture: '',
    username: 'admin',
    email: 'mypet.upgrade@gmail.com',
    password: adminPass,
    role: 'admin',
    location: {
      type: 'Point',
      coordinates: [40.403439, -3.707609],
    },
  },
  {
    picture: '',
    username: 'Andrea',
    email: 'email@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['walker', 'trainer'],
    location: {
      type: 'Point',
      coordinates: [40.521325, -3.610948],
    },
  },
  {
    picture: '',
    username: 'Stefano',
    email: 'email1@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['walker', 'trainer'],
    location: {
      type: 'Point',
      coordinates: [40.515215, -3.66154],
    },
  },
  {
    picture: '',
    username: 'Mary',
    email: 'email2@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['walker', 'sitter'],
    location: {
      type: 'Point',
      coordinates: [40.484744, -3.627563],
    },
  },
  {
    picture: '',
    username: 'Adiana',
    email: 'email3@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['trainer'],
    location: {
      type: 'Point',
      coordinates: [40.554862, -3.64751],
    },
  },
  {
    picture: '',
    username: 'Jesús',
    email: 'email4@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['walker'],
    location: {
      type: 'Point',
      coordinates: [40.515215, -3.66154],
    },
  },
  {
    picture: '',
    username: 'Cristian',
    email: 'email5@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['walker', 'trainer', 'sitter'],
    location: {
      type: 'Point',
      coordinates: [40.428078, -3.590428],
    },
  },
  {
    picture: '',
    username: 'Fran',
    email: 'email6@mypet.com',
    password: hashPass,
    role: 'caretaker',
    services: ['sitter', 'walker'],
    location: {
      type: 'Point',
      coordinates: [40.481281, -3.581982],
    },
  },
]

const usersInstances = usersSeed.map((user) => new User(user))

// const DB_URI_DEV = 'mongodb://localhost:27017/my_pet'
const { NODE_ENV, DB_URI_DEV, DB_URI_PROD } = process.env

const DB_URL = NODE_ENV === 'production' ? DB_URI_PROD : DB_URI_DEV
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Connected to database!')

    const users = await User.find()
    console.log('Estas son los usuarios de la DB:', users)

    if (users.length) {
      console.log('Como había usuarios previamente, vamos a hacer un drop para vaciar la DB...')
      await User.collection.drop()
      console.log('Hemos vaciado la colección users!')
    }

    console.log('Guardamos los usuarios en la DB...')
    await User.insertMany(usersInstances)
    console.log('Hemos insertado los usuarios!')
  })
  .catch((err) => {
    console.error(err.message)
    console.error('Could not connect to the database!')
  })
  .finally(() => {
    mongoose.disconnect()
  })

require('dotenv').config()
const mongoose = require('mongoose')

const Pet = require('../models/Pet')

const petsSeed = [
  {
    name: 'Curro',
    age: 4,
    type: 'dog',
    race: 'Beagle',
    gender: 'male',
  },
  {
    name: 'Luna',
    age: 8,
    type: 'cat',
    race: 'Siames',
    gender: 'female',
  },
  {
    name: 'Maya',
    age: 12,
    type: 'dog',
    race: 'Chihuahua',
    gender: 'female',
  },
  {
    name: 'Pirri',
    age: 3,
    type: 'bird',
    race: 'Periquito',
    gender: 'male',
  },
]

const petInstances = petsSeed.map((pet) => {
  return new Pet(pet)
})

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

    const pets = await Pet.find() // Busca todas las mascotas de la DB en colección pets
    console.log('Estas son las mascotas de la DB:', pets)

    // Miramos si había mascotas, y en ese caso las eliminamos...
    if (pets.length) {
      console.log('Como había mascotas previamente, vamos a hacer un drop para vaciar la DB...')
      await Pet.collection.drop()
      console.log('Hemos vaciado la colección pets!')
    }

    // Guardamos las instancias de mascota que creamos previamente
    console.log('Guardamos las mascotas en la DB...')
    await Pet.insertMany(petInstances)
    console.log('Hemos insertado las mascotas!')
  })
  .catch((err) => {
    console.error(err.message)
    console.error('Could not connect to the database!')
  })
  .finally(() => {
    mongoose.disconnect()
  })

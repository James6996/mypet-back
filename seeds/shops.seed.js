require('dotenv').config()
const mongoose = require('mongoose')

const Shop = require('../models/Shop')

const shopsSeed = [
  {
    name: 'Tienda 1',
    category: 'pet toys',
    contact: 'tienda1@tienda1.com',
    location: {
      coordinates: [40.451746, 3.696198],
    },
  },
  {
    name: 'Tienda 2',
    category: 'veterinary',
    contact: 'tienda2@tienda2.com',
    location: {
      coordinates: [40.427853, 3.675673],
    },
  },
  {
    name: 'Tienda 3',
    category: 'pet toys',
    contact: 'tienda3@tienda3.com',
    location: {
      coordinates: [40.426024, 3.686059],
    },
  },
  {
    name: 'Tienda 4',
    category: 'pet sitting',
    contact: 'tienda4@tienda1.com',
    location: {
      coordinates: [40.420829, 3.702968],
    },
  },
  {
    name: 'Tienda 5',
    category: 'veterinary',
    contact: 'tienda5@tienda5.com',
    location: {
      coordinates: [40.430613, 3.710467],
    },
  },
  {
    name: 'Tienda 6',
    category: 'adoption center',
    contact: 'tienda6@tienda1.com',
    location: {
      coordinates: [40.427952, 3.718085],
    },
  },
  {
    name: 'Tienda 7',
    category: 'pet sitting',
    contact: 'tienda7@tienda1.com',
    location: {
      coordinates: [40.431856, -3.714298],
    },
  },
  {
    name: 'Tienda 8',
    category: 'pet toys',
    contact: 'tienda8@tienda1.com',
    location: {
      coordinates: [40.421963, -3.688379],
    },
  },
  {
    name: 'Tienda 9',
    category: 'pet toys',
    contact: 'tienda9@tienda1.com',
    location: {
      coordinates: [40.426717, -3.691419],
    },
  },
  {
    name: 'Tienda 10',
    category: 'pet toys',
    contact: 'tienda10@tienda1.com',
    location: {
      coordinates: [40.431168, -3.685724],
    },
  },
  {
    name: 'Tienda 11',
    category: 'pet sitting',
    contact: 'tienda11@tienda1.com',
    location: {
      coordinates: [40.437111, -3.686409],
    },
  },
  {
    name: 'Tienda 12',
    category: 'pet sitting',
    contact: 'tienda12@tienda1.com',
    location: {
      coordinates: [40.408393, -3.67305],
    },
  },
  {
    name: 'Tienda 13',
    category: 'pet sitting',
    contact: 'tienda13@tienda1.com',
    location: {
      coordinates: [40.411971, -3.676451],
    },
  },
  {
    name: 'Tienda 14',
    category: 'veterinary',
    contact: 'tienda14@tienda1.com',
    location: {
      coordinates: [40.401951, -3.693863],
    },
  },
  {
    name: 'Tienda 15',
    category: 'adoption center',
    contact: 'tienda15@tienda1.com',
    location: {
      coordinates: [40.397495, -3.703322],
    },
  },
  {
    name: 'Tienda 16',
    category: 'veterinary',
    contact: 'tienda16@tienda1.com',
    location: {
      coordinates: [40.408465, -3.699998],
    },
  },
  {
    name: 'Tienda 17',
    category: 'adoption center',
    contact: 'tienda17@tienda1.com',
    location: {
      coordinates: [40.415256, -3.704241],
    },
  },
  {
    name: 'Tienda 18',
    category: 'veterinary',
    contact: 'tienda18@tienda1.com',
    location: {
      coordinates: [40.428759, -3.700619],
    },
  },
  {
    name: 'Tienda 19',
    category: 'adoption center',
    contact: 'tienda19@tienda1.com',
    location: {
      coordinates: [40.438657, -3.704353],
    },
  },
]

const shopsInstances = shopsSeed.map((shop) => {
  return new Shop(shop)
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

    const shops = await Shop.find()
    console.log('Estas son las tiendas de la DB:', shops)

    if (shops.length) {
      console.log('Como había tiendas previamente, vamos a hacer un drop para vaciar la DB...')
      await Shop.collection.drop()
      console.log('Hemos vaciado la colección shops!')
    }

    console.log('Guardamos las tiendas en la DB...')
    await Shop.insertMany(shopsInstances)
    console.log('Hemos insertado las tiendas!')
  })
  .catch((err) => {
    console.error(err.message)
    console.error('Could not connect to the database!')
  })
  .finally(() => {
    mongoose.disconnect()
  })

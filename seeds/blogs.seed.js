require('dotenv').config()
const mongoose = require('mongoose')

const Blog = require('../models/Blog')

const blogsSeed = [
  {
    image:
      'url: https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQjZFPhmV7V79kuCB2Ab5gj-o0tayH9qmfsKA&usqp=CAU',
    title: 'Mi mascota y el coronavirus',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit mi sapien, vel ultricies ipsum dictum a. Morbi vitae erat a augue molestie ultrices. Curabitur ut ullamcorper ligula, ullamcorper convallis ante. Mauris porttitor sem tortor, ultricies condimentum eros elementum et. Cras sed mauris massa. Donec pellentesque sem in magna volutpat hendrerit. Aenean nec ex fermentum sem tincidunt pulvinar vitae vitae neque. Mauris in erat tellus. Vivamus quis sapien auctor, ultricies sem vel, ullamcorper quam. Nunc interdum sapien et sapien ultricies, eu facilisis nulla dapibus. Vivamus et velit eros. Nam consectetur consequat vulputate. Donec eget metus viverra, placerat diam eu, mollis neque.',
  },
  {
    image:
      'url: https://www.purina-latam.com/sites/g/files/auxxlc391/files/styles/facebook_share/public/purina-hasta-que-edad-son-cachorros-los-perros.png?itok=aehQdFyU',
    title: 'Pensamientos ocultos',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit mi sapien, vel ultricies ipsum dictum a. Morbi vitae erat a augue molestie ultrices. Curabitur ut ullamcorper ligula, ullamcorper convallis ante. Mauris porttitor sem tortor, ultricies condimentum eros elementum et. Cras sed mauris massa. Donec pellentesque sem in magna volutpat hendrerit. Aenean nec ex fermentum sem tincidunt pulvinar vitae vitae neque. Mauris in erat tellus. Vivamus quis sapien auctor, ultricies sem vel, ullamcorper quam. Nunc interdum sapien et sapien ultricies, eu facilisis nulla dapibus. Vivamus et velit eros. Nam consectetur consequat vulputate. Donec eget metus viverra, placerat diam eu, mollis neque.',
  },
  {
    image:
      'url: https://www.purina-latam.com/sites/g/files/auxxlc391/files/styles/facebook_share/public/purina-hasta-que-edad-son-cachorros-los-perros.png?itok=aehQdFyUhttps://static.elcorreo.com/www/multimedia/201907/13/media/cortadas/Portada_Perros-Vitoria-kaHI-U80746594891KjF-1248x770@El%20Correo.png',
    title: 'Elige tu perro',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit mi sapien, vel ultricies ipsum dictum a. Morbi vitae erat a augue molestie ultrices. Curabitur ut ullamcorper ligula, ullamcorper convallis ante. Mauris porttitor sem tortor, ultricies condimentum eros elementum et. Cras sed mauris massa. Donec pellentesque sem in magna volutpat hendrerit. Aenean nec ex fermentum sem tincidunt pulvinar vitae vitae neque. Mauris in erat tellus. Vivamus quis sapien auctor, ultricies sem vel, ullamcorper quam. Nunc interdum sapien et sapien ultricies, eu facilisis nulla dapibus. Vivamus et velit eros. Nam consectetur consequat vulputate. Donec eget metus viverra, placerat diam eu, mollis neque.',
  },
]

const blogInstances = blogsSeed.map((blog) => {
  return new Blog(blog)
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

    const blogs = await Blog.find() // Busca todas las mascotas de la DB en colección pets
    console.log('Estas son los artículos de la DB:', blogs)

    // Miramos si había mascotas, y en ese caso las eliminamos...
    if (blogs.length) {
      console.log('Como había artículos previamente, vamos a hacer un drop para vaciar la DB...')
      await Blog.collection.drop()
      console.log('Hemos vaciado la colección blogs!')
    }

    // Guardamos las instancias de mascota que creamos previamente
    console.log('Guardamos los artículos en la DB...')
    await Blog.insertMany(blogInstances)
    console.log('Hemos insertado los artículos!')
  })
  .catch((err) => {
    console.error(err.message)
    console.error('Could not connect to the database!')
  })
  .finally(() => {
    mongoose.disconnect()
  })

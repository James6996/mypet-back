const mongoose = require('mongoose')

const { NODE_ENV, DB_URI_DEV, DB_URI_PROD } = process.env

const dbUri = NODE_ENV === 'production' ? DB_URI_PROD : DB_URI_DEV

mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to DB:', dbUri)
  })
  .catch((err) => {
    console.log('Error connecting to DB:', err.message)
  })

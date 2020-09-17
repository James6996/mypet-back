const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

// Configuración de procesado y guardado de archivos
const diskStorage = multer.diskStorage({
  filename: (req, file, done) => {
    // uso como nombre la fecha actual más el nombre original del archivo
    done(null, Date.now() + path.extname(file.originalname))
  },
  destination: (req, file, done) => {
    // Como segundo argumento del callback enviamos un string con la dirección
    // donde guardaremos los archivos en local
    done(null, path.join(__dirname, '../public/uploads'))
  },
})

const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']

// Uso un filtro de archivos para subir solo imágenes en png y jpg
const imageFileFilter = (req, file, done) => {
  if (!VALID_FILE_TYPES.includes(file.mimetype)) {
    done(new Error('Invalid file type'))
  } else {
    done(null, true)
  }
}

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (req.file) {
      // Utilizamos el path absoluto de nuestro archivo
      const filePath = req.file.path
      const image = await cloudinary.uploader.upload(filePath)

      // Añadimos filePath a nuestro req.file usando la url de la imagen de cloudinary
      req.file.filePath = image.secure_url

      // Borramos la imagen de nuestro servidor
      await fs.unlinkSync(filePath)
    }

    return next()
  } catch (err) {
    // En producción sería distinto...
    // req.file.filePath =
    // `${process.env.SERVER_DOMAIN}${process.env.PORT}/uploads/${req.file.filename}`
    req.file.filePath = `${process.env.SERVER_DOMAIN}${process.env.PORT}/uploads/${req.file.filename}`
    return next()
  }
}

const upload = multer({
  storage: diskStorage,
  fileFilter: imageFileFilter,
})

module.exports = { upload, uploadToCloudinary }

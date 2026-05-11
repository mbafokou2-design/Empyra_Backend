const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'services',
    resource_type: 'image',
    format: 'webp',
    transformation: [
      {
        width: 1200,
        crop: 'limit',
        quality: 'auto'
      }
    ]
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ]

    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only images are allowed'))
    }
  }
})

module.exports = upload
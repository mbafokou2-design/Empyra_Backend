const multer                = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary            = require('../config/cloudinary')

/*
  Images go straight to Cloudinary — no local folder.
  We let Cloudinary auto-generate the public_id
  so filenames are always unique.
*/
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'image',
    // No folder — images land at the root of your Cloudinary account
    format: async () => 'webp',   // convert everything to webp on upload
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }]
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter: function (req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed'), false)
    }
  }
})

module.exports = upload
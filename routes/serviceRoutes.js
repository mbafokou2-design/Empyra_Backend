const express = require('express')

const router = express.Router()

const {

  getServices,
  getServiceById,
  getServiceBySlug,
  getServicesByCategory,
  createService,
  updateService,
  deleteService,
  getServiceStats

} = require('../controllers/serviceController')

const { protect } = require('../middleware/authMiddleware')

/* CLOUDINARY MULTER */
const upload = require('../middleware/upload')

/* =============================================
   PUBLIC ROUTES
============================================= */

router.get('/', getServices)

router.get('/slug/:slug', getServiceBySlug)

router.get('/category/:category', getServicesByCategory)

router.get('/stats/overview', getServiceStats)

/* =============================================
   ADMIN ROUTES
============================================= */

router.get('/:id', protect, getServiceById)

/* FILE UPLOADS DIRECTLY TO CLOUDINARY */
router.post(
  '/',
  protect,
  upload.single('image'),
  createService
)

router.put(
  '/:id',
  protect,
  upload.single('image'),
  updateService
)

router.delete(
  '/:id',
  protect,
  deleteService
)

module.exports = router
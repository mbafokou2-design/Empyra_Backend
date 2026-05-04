const express = require('express');
const router = express.Router();

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

/* GET ALL */
router.get('/', protect, getServices);

/* GET ONE */
router.get('/:id', protect, getServiceById);

/* CREATE */
router.post('/', protect, upload.single('image'), createService);

/* UPDATE */
router.put('/:id', protect, upload.single('image'), updateService);

/* DELETE */
router.delete('/:id', protect, deleteService);

module.exports = router;
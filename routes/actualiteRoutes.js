const express = require('express');
const router = express.Router();

const {
  getAllActualites,
  getActualiteById,
  createActualite,
  updateActualite,
  deleteActualite
} = require('../controllers/actualiteController');

const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

/* ── GET ALL ── */
router.get('/', protect, getAllActualites);

/* ── GET ONE ── */
router.get('/:id', protect, getActualiteById);

/* ── CREATE ── */
router.post('/', protect, upload.single('image'), createActualite);

/* ── UPDATE ── */
router.put('/:id', protect, upload.single('image'), updateActualite);

/* ── DELETE ── */
router.delete('/:id', protect, deleteActualite);

module.exports = router;
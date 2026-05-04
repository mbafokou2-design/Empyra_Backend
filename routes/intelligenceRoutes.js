const express = require('express')
const router  = express.Router()

const {
  getIntelligences,
  getIntelligenceById,
  createIntelligence,
  updateIntelligence,
  deleteIntelligence,
  getIntelligenceStats
} = require('../controllers/intelligenceController')

const { protect } = require('../middleware/authMiddleware')
const upload      = require('../middleware/upload')

router.get('/',       protect, getIntelligences)
router.get('/stats',  protect, getIntelligenceStats)   // GET /api/intelligence/stats
router.get('/:id',    protect, getIntelligenceById)
router.post('/',      protect, upload.single('image'), createIntelligence)
router.put('/:id',    protect, upload.single('image'), updateIntelligence)
router.delete('/:id', protect, deleteIntelligence)

module.exports = router
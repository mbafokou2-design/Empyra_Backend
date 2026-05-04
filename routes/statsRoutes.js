const express = require('express')
const router  = express.Router()

const {
  getUserStats,
  getServiceStats,
  getIntelligenceStats,
  getBlogStats,
  getActualiteStats,
  getOverviewStats
} = require('../controllers/statsController')

const { protect } = require('../middleware/authMiddleware')

router.get('/users',        protect, getUserStats)
router.get('/services',     protect, getServiceStats)
router.get('/intelligence', protect, getIntelligenceStats)
router.get('/blog',         protect, getBlogStats)
router.get('/actualite',    protect, getActualiteStats)
router.get('/overview',     protect, getOverviewStats)

module.exports = router
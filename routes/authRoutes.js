const express = require('express')
const router = express.Router()

const {
  login,
  register
} = require('../controllers/authController')

const { protect } = require('../middleware/authMiddleware')

// login stays public
router.post('/login', login)

// register is now protected
router.post('/register', protect, register)

module.exports = router
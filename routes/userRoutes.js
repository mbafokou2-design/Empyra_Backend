const express = require('express')
const router = express.Router()

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController')

const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, getUsers)
router.get('/:id', protect, getUserById)
router.put('/:id', protect, updateUser)
router.delete('/:id', protect, deleteUser)

module.exports = router
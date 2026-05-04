const User = require('../models/User')

/* =========================
   GET ALL USERS
========================= */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* =========================
   GET SINGLE USER
========================= */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* =========================
   UPDATE USER
========================= */
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.first_name = req.body.first_name || user.first_name
    user.last_name  = req.body.last_name || user.last_name
    user.email      = req.body.email || user.email
    user.phone      = req.body.phone || user.phone
    user.country    = req.body.country || user.country
    user.status     = req.body.status || user.status

    const updated = await user.save()

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* =========================
   DELETE USER
========================= */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await user.deleteOne()

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/* =========================
   LOGIN (ADMIN ONLY)
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =========================
   REGISTER (DASHBOARD ONLY)
========================= */
exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      country,
      password,
      status
    } = req.body

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      first_name,
      last_name,
      email,
      phone,
      country,
      password: hashed,
      status
    })

    res.status(201).json({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
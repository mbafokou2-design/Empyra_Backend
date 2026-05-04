/*
  statsController.js
  Centralizes all dashboard stat card endpoints.
  Add this to controllers/ and register in server.js.

  These endpoints are called by dashboard-script.js
  to populate the 6 stat cards in real time.
*/

const User         = require('../models/User')
const Service      = require('../models/Service')
const Blog         = require('../models/Blog')
const Actualite    = require('../models/Actualite')
const Intelligence = require('../models/Intelligence')

/* =============================================
   GET /api/stats/users
   Returns: { count, change }
============================================= */
exports.getUserStats = async (req, res) => {
  try {
    const total = await User.countDocuments()

    // Users registered this month
    const now       = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonth  = await User.countDocuments({ createdAt: { $gte: monthStart } })

    res.json({
      count:  total,
      change: '+' + thisMonth + ' this month'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   GET /api/stats/services
   Returns: { count, change }
============================================= */
exports.getServiceStats = async (req, res) => {
  try {
    const total     = await Service.countDocuments()
    const published = await Service.countDocuments({ status: 'published' })
    res.json({
      count:  total,
      change: published + ' published'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   GET /api/stats/intelligence
   Returns: { count, change }
============================================= */
exports.getIntelligenceStats = async (req, res) => {
  try {
    const total     = await Intelligence.countDocuments()
    const published = await Intelligence.countDocuments({ status: 'published' })
    res.json({
      count:  total,
      change: published + ' published'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   GET /api/stats/blog
   Returns: { count, change }
============================================= */
exports.getBlogStats = async (req, res) => {
  try {
    const total    = await Blog.countDocuments()
    const weekAgo  = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const thisWeek = await Blog.countDocuments({ createdAt: { $gte: weekAgo } })
    res.json({
      count:  total,
      change: '+' + thisWeek + ' this week'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   GET /api/stats/actualite
   Returns: { count, change }
============================================= */
exports.getActualiteStats = async (req, res) => {
  try {
    const total  = await Actualite.countDocuments()
    const latest = await Actualite.findOne().sort({ createdAt: -1 })
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const change = latest && latest.createdAt > yesterday
      ? 'Latest: today'
      : 'Latest: yesterday'
    res.json({ count: total, change })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   GET /api/stats/overview
   Returns array for the Content Overview panel.
============================================= */
exports.getOverviewStats = async (req, res) => {
  try {
    const [
      totalServices,     publishedServices,
      totalBlog,         publishedBlog,
      totalIntelligence, publishedIntelligence,
      totalActualite,    publishedActualite,
      totalUsers,        activeUsers
    ] = await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ status: 'published' }),
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Intelligence.countDocuments(),
      Intelligence.countDocuments({ status: 'published' }),
      Actualite.countDocuments(),
      Actualite.countDocuments({ status: 'published' }),
      User.countDocuments(),
      User.countDocuments({ status: 'active' })
    ])

    res.json([
      { label: 'Published Services',       value: publishedServices,    total: totalServices,     color: '#f5c518' },
      { label: 'Blog Posts Published',     value: publishedBlog,        total: totalBlog,         color: '#ea5c3a' },
      { label: 'Intelligence Reports',     value: publishedIntelligence, total: totalIntelligence, color: '#16a34a' },
      { label: 'Actualités Published',     value: publishedActualite,   total: totalActualite,    color: '#7c3aed' },
      { label: 'Active Users',             value: activeUsers,          total: totalUsers,        color: '#0891b2' }
    ])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
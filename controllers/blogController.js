const Blog       = require('../models/Blog')
const cloudinary = require('../config/cloudinary')

/* =============================================
   GET ALL BLOG POSTS
   GET /api/blog
   Optional query: ?status=published&category=mining
============================================= */
exports.getBlogs = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status)   filter.status   = req.query.status
    if (req.query.category) filter.category = req.query.category

    const blogs = await Blog.find(filter).sort({ createdAt: -1 })
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   GET SINGLE BLOG POST
   GET /api/blog/:id
============================================= */
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog post not found' })
    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   CREATE BLOG POST
   POST /api/blog
   Content-Type: multipart/form-data
   Fields: title_en, title_fr, text_en, text_fr,
           category, status, icon
   File:   image (optional)
============================================= */
exports.createBlog = async (req, res) => {
  try {
    const { title_en, title_fr, text_en, text_fr, category, status, icon } = req.body

    if (!title_en || !title_fr || !text_en || !text_fr || !category) {
      return res.status(400).json({
        message: 'title_en, title_fr, text_en, text_fr, and category are required'
      })
    }

    let image_url       = ''
    let image_public_id = ''
    if (req.file) {
      image_url       = req.file.path
      image_public_id = req.file.filename
    }

    const blog = await Blog.create({
      title_en, title_fr,
      text_en,  text_fr,
      category,
      status:          status || 'published',
      icon:            icon   || 'ph-newspaper',
      image_url,
      image_public_id
    })

    res.status(201).json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   UPDATE BLOG POST
   PUT /api/blog/:id
   Sending a new image replaces the old one on Cloudinary.
============================================= */
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog post not found' })

    const { title_en, title_fr, text_en, text_fr, category, status, icon } = req.body

    if (req.file && blog.image_public_id) {
      await cloudinary.uploader.destroy(blog.image_public_id)
    }

    blog.title_en = title_en || blog.title_en
    blog.title_fr = title_fr || blog.title_fr
    blog.text_en  = text_en  || blog.text_en
    blog.text_fr  = text_fr  || blog.text_fr
    blog.category = category || blog.category
    blog.status   = status   || blog.status
    blog.icon     = icon     || blog.icon

    if (req.file) {
      blog.image_url       = req.file.path
      blog.image_public_id = req.file.filename
    }

    const updated = await blog.save()
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   DELETE BLOG POST
   DELETE /api/blog/:id
   Also deletes the image from Cloudinary.
============================================= */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog post not found' })

    if (blog.image_public_id) {
      await cloudinary.uploader.destroy(blog.image_public_id)
    }

    await blog.deleteOne()
    res.json({ message: 'Blog post deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   STATS (for dashboard stat card)
   GET /api/stats/blog
   Returns: { count, change }
============================================= */
exports.getBlogStats = async (req, res) => {
  try {
    const total     = await Blog.countDocuments()
    const published = await Blog.countDocuments({ status: 'published' })

    // Posts created this week
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
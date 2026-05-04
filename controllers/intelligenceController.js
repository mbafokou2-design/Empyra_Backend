const Intelligence = require('../models/Intelligence')
const cloudinary   = require('../config/cloudinary')

/* GET ALL — GET /api/intelligence */
exports.getIntelligences = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status)   filter.status   = req.query.status
    if (req.query.category) filter.category = req.query.category
    const items = await Intelligence.find(filter).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* GET ONE — GET /api/intelligence/:id */
exports.getIntelligenceById = async (req, res) => {
  try {
    const item = await Intelligence.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Intelligence entry not found' })
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* CREATE — POST /api/intelligence */
exports.createIntelligence = async (req, res) => {
  try {
    const { title_en, title_fr, text_en, text_fr, category, status, icon } = req.body

    if (!title_en || !title_fr || !text_en || !text_fr || !category) {
      return res.status(400).json({
        message: 'title_en, title_fr, text_en, text_fr, and category are required'
      })
    }

    let image_url = '', image_public_id = ''
    if (req.file) {
      image_url       = req.file.path
      image_public_id = req.file.filename
    }

    const item = await Intelligence.create({
      title_en, title_fr, text_en, text_fr, category,
      status:          status || 'published',
      icon:            icon   || 'ph-brain',
      image_url,
      image_public_id
    })

    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* UPDATE — PUT /api/intelligence/:id */
exports.updateIntelligence = async (req, res) => {
  try {
    const item = await Intelligence.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Intelligence entry not found' })

    const { title_en, title_fr, text_en, text_fr, category, status, icon } = req.body

    if (req.file && item.image_public_id) {
      await cloudinary.uploader.destroy(item.image_public_id)
    }

    item.title_en = title_en || item.title_en
    item.title_fr = title_fr || item.title_fr
    item.text_en  = text_en  || item.text_en
    item.text_fr  = text_fr  || item.text_fr
    item.category = category || item.category
    item.status   = status   || item.status
    item.icon     = icon     || item.icon

    if (req.file) {
      item.image_url       = req.file.path
      item.image_public_id = req.file.filename
    }

    const updated = await item.save()
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* DELETE — DELETE /api/intelligence/:id */
exports.deleteIntelligence = async (req, res) => {
  try {
    const item = await Intelligence.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Intelligence entry not found' })

    if (item.image_public_id) {
      await cloudinary.uploader.destroy(item.image_public_id)
    }

    await item.deleteOne()
    res.json({ message: 'Intelligence entry deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* STATS — GET /api/stats/intelligence */
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
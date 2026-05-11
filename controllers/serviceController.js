const Service    = require('../models/Service')
const cloudinary = require('../config/cloudinary')

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/['"“”‘’]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* GET ALL */
exports.getServices = async (req, res, next) => {
  try {

    const filter = {}

    if (req.query.status) {
      filter.status = req.query.status
    }

    if (req.query.category) {
      filter.category = req.query.category
    }

    const services = await Service
      .find(filter)
      .sort({ createdAt: -1 })

    res.json(services)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* GET BY ID */
exports.getServiceById = async (req, res, next) => {
  try {

    const service = await Service.findById(req.params.id)

    if (!service) {
      return res.status(404).json({
        message: 'Service not found'
      })
    }

    res.json(service)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* GET BY SLUG */
exports.getServiceBySlug = async (req, res, next) => {
  try {

    const service = await Service.findOne({
      slug: req.params.slug.toLowerCase()
    })

    if (!service) {
      return res.status(404).json({
        message: 'Service not found'
      })
    }

    res.json(service)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* GET BY CATEGORY */
exports.getServicesByCategory = async (req, res, next) => {
  try {

    const services = await Service.find({
      category: req.params.category
    }).sort({ createdAt: -1 })

    res.json(services)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* CREATE */
exports.createService = async (req, res, next) => {
  try {

    const {
      title_en,
      title_fr,
      desc_en,
      desc_fr,
      category,
      status,
      icon,
      slug,

      intro_en,
      intro_fr,

      body_en,
      body_fr,

      body2_en,
      body2_fr,

      highlight_en,
      highlight_fr,

      bullets_en,
      bullets_fr

    } = req.body

    if (
      !title_en ||
      !title_fr ||
      !desc_en  ||
      !desc_fr  ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    /* FILE ALREADY UPLOADED TO CLOUDINARY */
    let image_url       = ''
    let image_public_id = ''

    if (req.file) {
      image_url       = req.file.path
      image_public_id = req.file.filename
    }

    const service = await Service.create({

      title_en,
      title_fr,

      desc_en,
      desc_fr,

      intro_en,
      intro_fr,

      body_en,
      body_fr,

      body2_en,
      body2_fr,

      highlight_en,
      highlight_fr,

      bullets_en: bullets_en
        ? bullets_en.split('\n').map(i => i.trim()).filter(Boolean)
        : [],

      bullets_fr: bullets_fr
        ? bullets_fr.split('\n').map(i => i.trim()).filter(Boolean)
        : [],

      category,

      status: status || 'published',

      icon: icon || 'ph-star',

      slug: slug && slug.trim()
        ? slugify(slug)
        : slugify(title_en),

      image_url,
      image_public_id
    })

    res.status(201).json(service)

  } catch (err) {
    console.log('Error in createService:', err)
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

/* UPDATE */
exports.updateService = async (req, res, next) => {
  try {

    const service = await Service.findById(req.params.id)

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    const {
      title_en,
      title_fr,

      desc_en,
      desc_fr,

      category,
      status,
      icon,
      slug,

      intro_en,
      intro_fr,

      body_en,
      body_fr,

      body2_en,
      body2_fr,

      highlight_en,
      highlight_fr,

      bullets_en,
      bullets_fr

    } = req.body

    /* DELETE OLD CLOUDINARY IMAGE */
    if (req.file && service.image_public_id) {
      await cloudinary.uploader.destroy(service.image_public_id)
    }

    service.title_en = title_en || service.title_en
    service.title_fr = title_fr || service.title_fr

    service.desc_en = desc_en || service.desc_en
    service.desc_fr = desc_fr || service.desc_fr

    service.intro_en = intro_en || service.intro_en
    service.intro_fr = intro_fr || service.intro_fr

    service.body_en = body_en || service.body_en
    service.body_fr = body_fr || service.body_fr

    service.body2_en = body2_en || service.body2_en
    service.body2_fr = body2_fr || service.body2_fr

    service.highlight_en = highlight_en || service.highlight_en
    service.highlight_fr = highlight_fr || service.highlight_fr

    service.bullets_en = bullets_en
      ? bullets_en.split('\n').map(i => i.trim()).filter(Boolean)
      : service.bullets_en

    service.bullets_fr = bullets_fr
      ? bullets_fr.split('\n').map(i => i.trim()).filter(Boolean)
      : service.bullets_fr

    service.category = category || service.category
    service.status   = status   || service.status
    service.icon     = icon     || service.icon

    service.slug = slug !== undefined
      ? (
          slug.trim()
            ? slugify(slug)
            : slugify(title_en || service.title_en)
        )
      : service.slug

    /* FILE ALREADY UPLOADED TO CLOUDINARY */
    if (req.file) {
      service.image_url       = req.file.path
      service.image_public_id = req.file.filename
    }

    const updated = await service.save()

    res.json(updated)

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

/* DELETE */
exports.deleteService = async (req, res, next) => {
  try {

    const service = await Service.findById(req.params.id)

    if (!service) {
      return res.status(404).json({
        message: 'Service not found'
      })
    }

    if (service.image_public_id) {
      await cloudinary.uploader.destroy(
        service.image_public_id
      )
    }

    await service.deleteOne()

    res.json({
      message: 'Service deleted successfully'
    })

  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}

/* STATS */
exports.getServiceStats = async (req, res, next) => {
  try {

    const total = await Service.countDocuments()

    const published = await Service.countDocuments({
      status: 'published'
    })

    res.json({
      count: total,
      change: published + ' published'
    })

  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}
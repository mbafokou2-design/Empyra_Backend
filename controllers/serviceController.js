const Service    = require('../models/Service')
const cloudinary = require('../config/cloudinary')

/* =============================================
   GET ALL SERVICES
   GET /api/services
   Query params (all optional):
     ?status=published
     ?category=environment
   Returns array sorted newest first.
============================================= */
exports.getServices = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status)   filter.status   = req.query.status
    if (req.query.category) filter.category = req.query.category

    const services = await Service.find(filter).sort({ createdAt: -1 })
    res.json(services)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   GET SINGLE SERVICE
   GET /api/services/:id
============================================= */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ message: 'Service not found' })
    res.json(service)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   CREATE SERVICE
   POST /api/services
   Content-Type: multipart/form-data
   Fields: title_en, title_fr, desc_en, desc_fr,
           category, status, icon, slug
   File:   image (optional)
============================================= */
exports.createService = async (req, res) => {
  try {
    const {
      title_en, title_fr,
      desc_en, desc_fr,
      category, status,
      icon, slug
    } = req.body;

    /* ✅ VALIDATION */
    if (!title_en || !title_fr || !desc_en || !desc_fr || !category) {
      return res.status(400).json({
        success: false,
        message: 'title_en, title_fr, desc_en, desc_fr, and category are required'
      });
    }

    /* 🚨 IMAGE SIZE CHECK (3MB LIMIT) */
    if (req.file && req.file.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image too large. Maximum allowed size is 3MB.'
      });
    }

    let image_url = '';
    let image_public_id = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'services'
      });

      image_url = result.secure_url;
      image_public_id = result.public_id;
    }

    const service = await Service.create({
      title_en, title_fr,
      desc_en, desc_fr,
      category,
      status: status || 'published',
      icon: icon || 'ph-star',
      slug: slug || '',
      image_url,
      image_public_id
    });

    res.status(201).json({
      success: true,
      data: service
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* =============================================
   UPDATE SERVICE
   PUT /api/services/:id
   Content-Type: multipart/form-data
   Sending a new image replaces the old one on Cloudinary.
   Not sending an image keeps the existing one.
============================================= */
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const {
      title_en, title_fr,
      desc_en, desc_fr,
      category, status,
      icon, slug
    } = req.body;

    /* 🚨 IMAGE SIZE CHECK (3MB LIMIT) */
    if (req.file && req.file.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image too large. Maximum allowed size is 3MB.'
      });
    }

    /* delete old image only if new one is valid */
    if (req.file && service.image_public_id) {
      await cloudinary.uploader.destroy(service.image_public_id);
    }

    service.title_en = title_en || service.title_en;
    service.title_fr = title_fr || service.title_fr;
    service.desc_en  = desc_en  || service.desc_en;
    service.desc_fr  = desc_fr  || service.desc_fr;
    service.category = category || service.category;
    service.status   = status   || service.status;
    service.icon     = icon     || service.icon;
    service.slug     = slug !== undefined ? slug : service.slug;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'services'
      });

      service.image_url = result.secure_url;
      service.image_public_id = result.public_id;
    }

    const updated = await service.save();

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* =============================================
   DELETE SERVICE
   DELETE /api/services/:id
   Also deletes the image from Cloudinary.
============================================= */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ message: 'Service not found' })

    /* Delete image from Cloudinary if it exists */
    if (service.image_public_id) {
      await cloudinary.uploader.destroy(service.image_public_id)
    }

    await service.deleteOne()
    res.json({ message: 'Service deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* =============================================
   STATS (for dashboard stat card)
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
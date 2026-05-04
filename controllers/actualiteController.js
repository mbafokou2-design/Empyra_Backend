const Actualite = require('../models/Actualite');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/* GET ALL */
exports.getAllActualites = async (req, res) => {
  try {
    const data = await Actualite.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ONE */
exports.getActualiteById = async (req, res) => {
  try {
    const item = await Actualite.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* CREATE */
exports.createActualite = async (req, res) => {
  try {
    let imageData = {};

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'actualites'
      });

      imageData = {
        image_url: result.secure_url,
        image_public_id: result.public_id
      };

      
    }

    const newItem = await Actualite.create({
      title_en: req.body.title_en,
      title_fr: req.body.title_fr,
      text_en: req.body.text_en,
      text_fr: req.body.text_fr,
      category: req.body.category,
      status: req.body.status,
      icon: req.body.icon,
      ...imageData
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
exports.updateActualite = async (req, res) => {
  try {
    const item = await Actualite.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    let imageData = {};

    if (req.file) {
      // 1. Upload new image FIRST
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'actualites'
      });

      // 2. Only after successful upload → delete old image
      if (item.image_public_id) {
        await cloudinary.uploader.destroy(item.image_public_id);
      }

      imageData = {
        image_url: result.secure_url,
        image_public_id: result.public_id
      };
    }

    const updated = await Actualite.findByIdAndUpdate(
      req.params.id,
      {
        title_en: req.body.title_en,
        title_fr: req.body.title_fr,
        text_en: req.body.text_en,
        text_fr: req.body.text_fr,
        category: req.body.category,
        status: req.body.status,
        icon: req.body.icon,
        ...imageData
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
exports.deleteActualite = async (req, res) => {
  try {
    const item = await Actualite.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    if (item.image_public_id) {
      await cloudinary.uploader.destroy(item.image_public_id);
    }

    await Actualite.findByIdAndDelete(req.params.id);

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const mongoose = require('mongoose')

const intelligenceSchema = new mongoose.Schema(
  {
    title_en: { type: String, required: true, trim: true },
    title_fr: { type: String, required: true, trim: true },
    text_en:  { type: String, required: true },
    text_fr:  { type: String, required: true },

    category: {
      type: String,
      required: true,
      enum: ['operations', 'risk', 'water', 'environment', 'closure', 'training']
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
    },

    icon: { type: String, default: 'ph-brain' },

    image_url:       { type: String, default: '' },
    image_public_id: { type: String, default: '' }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Intelligence', intelligenceSchema)
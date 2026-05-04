const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
  {
    /* ── Bilingual content ── */
    title_en: { type: String, required: true, trim: true },
    title_fr: { type: String, required: true, trim: true },
    text_en:  { type: String, required: true },
    text_fr:  { type: String, required: true },

    /* ── Metadata ── */
    category: {
      type: String,
      required: true,
      enum: ['mining', 'environment', 'analysis', 'technology', 'sustainability', 'interview']
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
    },

    /* ── UI ── */
    icon: { type: String, default: 'ph-newspaper' },

    /* ── Image (Cloudinary) ── */
    image_url:       { type: String, default: '' },
    image_public_id: { type: String, default: '' }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Blog', blogSchema)
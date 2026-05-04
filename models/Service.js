const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
  {
    /* ── Bilingual content ── */
    title_en: { type: String, required: true, trim: true },
    title_fr: { type: String, required: true, trim: true },
    desc_en:  { type: String, required: true },
    desc_fr:  { type: String, required: true },

    /* ── Metadata ── */
    category: {
      type: String,
      required: true,
      enum: ['environment', 'audit', 'exploration', 'engineering']
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
    },

    /* ── UI ── */
    icon: { type: String, default: 'ph-star' }, // Phosphor icon class
    slug: { type: String, default: '' },         // public site page link

    /* ── Image (Cloudinary) ── */
    image_url:       { type: String, default: '' },
    image_public_id: { type: String, default: '' } // needed to delete from Cloudinary
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
)

module.exports = mongoose.model('Service', serviceSchema)
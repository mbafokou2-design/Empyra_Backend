const mongoose = require('mongoose')

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

const serviceSchema = new mongoose.Schema(
  {
    /* ── Bilingual content ── */
    title_en: { type: String, required: true, trim: true },
    title_fr: { type: String, required: true, trim: true },

    desc_en: { type: String, required: true },
    desc_fr: { type: String, required: true },

    /* ── Rich content ── */
    intro_en: { type: String, default: '' },
    intro_fr: { type: String, default: '' },

    body_en: { type: String, default: '' },
    body_fr: { type: String, default: '' },

    body2_en: { type: String, default: '' },
    body2_fr: { type: String, default: '' },

    highlight_en: { type: String, default: '' },
    highlight_fr: { type: String, default: '' },

    bullets_en: [{ type: String }],
    bullets_fr: [{ type: String }],

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
    icon: {
      type: String,
      default: 'ph-star'
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },

    /* ── Image ── */
    image_url: {
      type: String,
      default: ''
    },

    image_public_id: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

serviceSchema.pre('validate', function() {
  if (!this.slug && this.title_en) {
    this.slug = slugify(this.title_en)
  }
})

module.exports = mongoose.model('Service', serviceSchema)
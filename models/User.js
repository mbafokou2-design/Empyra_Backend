const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: '' },
    country: { type: String, default: '' },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
)

/*
  IMPORTANT:
  MongoDB will automatically create the collection "users"
  when we insert the first document.
*/
module.exports = mongoose.model('User', userSchema)
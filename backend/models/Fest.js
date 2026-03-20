const mongoose = require('mongoose');

const festSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Kannada Kalarava', 'Sanskrithi'],
  },
  tagline: { type: String },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  venue: { type: String },
  banner: { type: String, default: '' },
  logo: { type: String, default: '' },
  theme: {
    primary: { type: String, default: '#f18b0a' },
    secondary: { type: String, default: '#f9c24f' },
  },
  isActive: { type: Boolean, default: true },
  registrationOpen: { type: Boolean, default: true },
  socialLinks: {
    instagram: String,
    facebook: String,
    whatsapp: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Fest', festSchema);

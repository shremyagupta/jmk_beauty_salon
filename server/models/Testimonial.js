const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  text: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);


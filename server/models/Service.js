const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['hair', 'nails', 'facial', 'massage', 'makeup', 'spa']
  },
  description: {
    type: String,
    required: true
  },
  services: [{
    type: String
  }],
  icon: {
    type: String,
    default: '✨'
  },
  price: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    default: '1 hour'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);


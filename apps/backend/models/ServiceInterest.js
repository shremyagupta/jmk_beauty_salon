const mongoose = require('mongoose');

const serviceInterestSchema = new mongoose.Schema({
  // Optional link to a registered user (not required if guest)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  requestedServices: [{
    type: String,
    trim: true,
    required: true
  }],
  note: {
    type: String,
    trim: true,
    default: ''
  },
  source: {
    type: String,
    trim: true,
    default: 'calendly'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'archived'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceInterest', serviceInterestSchema);



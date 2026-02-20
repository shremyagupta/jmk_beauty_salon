const mongoose = require('mongoose');

const stylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  specialties: [{
    type: String,
    enum: ['hair-cutting', 'hair-coloring', 'makeup', 'nails', 'facial', 'massage', 'spa', 'bridal']
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  bio: String,
  profileImage: String,
  isAvailable: {
    type: Boolean,
    default: true
  },
  workingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  averageServiceTime: {
    type: Number,
    default: 60 // minutes
  },
  completedAppointments: {
    type: Number,
    default: 0
  },
  customerSatisfaction: {
    type: Number,
    default: 0
  },
  certifications: [String],
  languages: [String],
  awards: [String],
  socialMedia: {
    instagram: String,
    facebook: String,
    portfolio: String
  },
  preferredCustomers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }],
  skills: {
    cutting: { type: Number, min: 1, max: 5, default: 3 },
    coloring: { type: Number, min: 1, max: 5, default: 3 },
    styling: { type: Number, min: 1, max: 5, default: 3 },
    makeup: { type: Number, min: 1, max: 5, default: 3 },
    customerService: { type: Number, min: 1, max: 5, default: 3 }
  },
  commission: {
    type: Number,
    default: 0.3 // 30%
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
stylistSchema.index({ specialties: 1 });
stylistSchema.index({ isAvailable: 1 });
stylistSchema.index({ rating: -1 });

module.exports = mongoose.model('Stylist', stylistSchema);

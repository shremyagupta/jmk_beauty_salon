const mongoose = require('mongoose');

const beautyConsultationSchema = new mongoose.Schema({
  customerName: {
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
  skinType: {
    type: String,
    enum: ['normal', 'oily', 'dry', 'combination', 'sensitive'],
    required: true
  },
  skinConcerns: [{
    type: String,
    enum: ['acne', 'aging', 'dark-spots', 'uneven-tone', 'dryness', 'sensitivity', 'large-pores']
  }],
  preferredStyle: {
    type: String,
    enum: ['natural', 'glamorous', 'professional', 'trendy', 'classic']
  },
  budgetRange: {
    type: String,
    enum: ['budget', 'mid-range', 'premium', 'luxury']
  },
  allergies: [{
    type: String
  }],
  previousTreatments: [{
    type: String
  }],
  consultationDate: {
    type: Date,
    default: Date.now
  },
  recommendations: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    product: String,
    reason: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }],
  tryOnData: {
    faceShape: String,
    skinTone: String,
    recommendedColors: [String],
    recommendedStyles: [String]
  },
  followUpDate: Date,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: String
}, {
  timestamps: true
});

// Index for faster queries
beautyConsultationSchema.index({ email: 1, consultationDate: -1 });
beautyConsultationSchema.index({ status: 1 });

module.exports = mongoose.model('BeautyConsultation', beautyConsultationSchema);

const mongoose = require('mongoose');

const smartBookingSchema = new mongoose.Schema({
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
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  stylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stylist',
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: String,
  totalPrice: {
    type: Number,
    required: true
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },
  packageDeal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PackageDeal'
  },
  aiPredictedWaitTime: {
    type: Number,
    default: 0
  },
  actualWaitTime: {
    type: Number
  },
  customerSatisfactionScore: {
    type: Number,
    min: 1,
    max: 5
  },
  preferredStylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stylist'
  },
  isFlexibleTiming: {
    type: Boolean,
    default: false
  },
  specialRequests: String,
  reminderSent: {
    type: Boolean,
    default: false
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
smartBookingSchema.index({ email: 1, date: -1 });
smartBookingSchema.index({ date: 1, time: 1 });
smartBookingSchema.index({ status: 1 });
smartBookingSchema.index({ stylist: 1, date: 1 });

// Pre-save middleware to update timestamps
smartBookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('SmartBooking', smartBookingSchema);

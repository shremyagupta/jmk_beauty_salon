const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const SmartBooking = require('../models/smartBooking');
const Testimonial = require('../models/Testimonial');
const { authenticateToken, authorizeRoles } = require('../middleware/adminAuth');

// Admin analytics overview
router.get('/analytics/overview', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [appointmentStats, smartBookingStats, testimonialStats] = await Promise.all([
      getAppointmentStats(),
      getSmartBookingStats(),
      getTestimonialStats(),
    ]);

    res.json({
      appointments: appointmentStats,
      smartBookings: smartBookingStats,
      testimonials: testimonialStats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getAppointmentStats() {
  try {
    const collection = Appointment.collection;

    const total = await collection.countDocuments({});

    const byStatusAgg = await collection
      .aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ])
      .toArray();

    const byStatus = byStatusAgg.reduce((acc, item) => {
      acc[item._id || 'unknown'] = item.count;
      return acc;
    }, {});

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayCount = await collection.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });

    return {
      total,
      byStatus,
      today: todayCount,
    };
  } catch (err) {
    console.error('Error generating appointment stats', err);
    return {
      total: 0,
      byStatus: {},
      today: 0,
    };
  }
}

async function getSmartBookingStats() {
  const total = await SmartBooking.countDocuments();
  if (total === 0) {
    return {
      total: 0,
      revenue: 0,
      averageBookingValue: 0,
      cancellationRate: 0,
    };
  }

  const bookings = await SmartBooking.find();
  const revenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const averageBookingValue = bookings.length > 0 ? revenue / bookings.length : 0;
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length;
  const cancellationRate = bookings.length > 0 ? (cancelled / bookings.length) * 100 : 0;

  return {
    total,
    revenue,
    averageBookingValue,
    cancellationRate,
  };
}

async function getTestimonialStats() {
  const total = await Testimonial.countDocuments();
  const approved = await Testimonial.countDocuments({ isApproved: true });
  const pending = await Testimonial.countDocuments({ isApproved: false });

  const ratingAgg = await Testimonial.aggregate([
    { $match: { isApproved: true, rating: { $gte: 1 } } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  const avgRating = ratingAgg.length > 0 ? ratingAgg[0].avgRating : 0;

  return {
    total,
    approved,
    pending,
    avgRating,
  };
}

module.exports = router;

const express = require('express');
const router = express.Router();
const SmartBooking = require('../models/smartBooking');
const Service = require('../models/Service');
const Stylist = require('../models/stylist');
const nodemailer = require('nodemailer');
const { authenticateToken, authorizeRoles } = require('../middleware/adminAuth');

// Get all bookings (Admin)
router.get('/', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const bookings = await SmartBooking.find()
      .populate('service')
      .populate('stylist')
      .populate('packageDeal')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking by ID (Admin)
router.get('/:id', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const booking = await SmartBooking.findById(req.params.id)
      .populate('service')
      .populate('stylist')
      .populate('packageDeal');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings by customer email
router.get('/customer/:email', async (req, res) => {
  try {
    const bookings = await SmartBooking.find({ email: req.params.email })
      .populate('service')
      .populate('stylist')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available time slots for a specific date and service
router.get('/availability/:date/:serviceId', async (req, res) => {
  try {
    const { date, serviceId } = req.params;
    const service = await Service.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Get existing bookings for the date
    const existingBookings = await SmartBooking.find({
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    }).populate('stylist');

    // Generate available time slots
    const availableSlots = generateAvailableSlots(existingBookings, service.duration);
    
    res.json({
      date,
      service,
      availableSlots,
      totalSlots: availableSlots.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get AI-powered availability predictions
router.get('/predictions/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { startDate, endDate } = req.query;
    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Analyze historical booking patterns
    const historicalData = await analyzeBookingPatterns(serviceId, startDate, endDate);
    
    // Generate predictions using business logic
    const predictions = generateAvailabilityPredictions(historicalData, service);
    
    res.json({
      service,
      predictions,
      recommendations: getOptimalBookingTimes(predictions)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available stylists for a service
router.get('/stylists/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Get stylists who specialize in this service
    const stylists = await Stylist.find({
      specialties: service.category,
      isAvailable: true,
      isActive: true
    }).sort({ rating: -1, experience: -1 });

    res.json({
      service,
      stylists: stylists.map(stylist => ({
        ...stylist.toJSON(),
        availability: getStylistAvailability(stylist, new Date())
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Validate booking data
    const validation = await validateBookingData(bookingData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.errors 
      });
    }

    // Check for conflicts
    const conflicts = await checkBookingConflicts(bookingData);
    if (conflicts.length > 0) {
      return res.status(409).json({ 
        message: 'Booking conflicts detected', 
        conflicts 
      });
    }

    // Calculate AI-predicted wait time
    bookingData.aiPredictedWaitTime = await calculatePredictedWaitTime(bookingData);

    const booking = new SmartBooking(bookingData);
    const savedBooking = await booking.save();
    
    // Send confirmation email
    await sendBookingConfirmation(savedBooking);
    
    // Send SMS reminder (if configured)
    // await sendSMSReminder(savedBooking);

    const populatedBooking = await SmartBooking.findById(savedBooking._id)
      .populate('service')
      .populate('stylist');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await SmartBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('service').populate('stylist');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Send update notification
    if (req.body.status && req.body.status !== booking.status) {
      await sendBookingUpdateNotification(booking);
    }
    
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel booking
router.post('/:id/cancel', async (req, res) => {
  try {
    const { reason, refundRequested } = req.body;
    
    const booking = await SmartBooking.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        cancellationReason: reason,
        refundRequested: refundRequested || false,
        cancelledAt: new Date()
      },
      { new: true }
    ).populate('service').populate('stylist');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Send cancellation confirmation
    await sendCancellationConfirmation(booking);
    
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking analytics (Admin)
router.get('/analytics/dashboard', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const analytics = await generateBookingAnalytics(startDate, endDate);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper functions
function generateAvailableSlots(existingBookings, serviceDuration) {
  const slots = [];
  const workingHours = { start: '09:00', end: '20:00' };
  const slotDuration = 30; // minutes
  
  for (let hour = parseInt(workingHours.start); hour < parseInt(workingHours.end); hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Check if slot is available
      const isAvailable = !existingBookings.some(booking => {
        const bookingTime = booking.time;
        const bookingEnd = addMinutesToTime(bookingTime, booking.duration || serviceDuration);
        const slotEnd = addMinutesToTime(time, slotDuration);
        
        return (time >= bookingTime && time < bookingEnd) || 
               (slotEnd > bookingTime && slotEnd <= bookingEnd) ||
               (time <= bookingTime && slotEnd >= bookingEnd);
      });
      
      if (isAvailable) {
        slots.push({ time, available: true });
      }
    }
  }
  
  return slots;
}

function addMinutesToTime(time, minutes) {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

async function analyzeBookingPatterns(serviceId, startDate, endDate) {
  // Analyze historical booking data for patterns
  const bookings = await SmartBooking.find({
    service: serviceId,
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    status: { $in: ['confirmed', 'completed'] }
  });
  
  return {
    totalBookings: bookings.length,
    peakHours: calculatePeakHours(bookings),
    peakDays: calculatePeakDays(bookings),
    averageWaitTime: calculateAverageWaitTime(bookings),
    cancellationRate: calculateCancellationRate(bookings)
  };
}

function generateAvailabilityPredictions(historicalData, service) {
  // Business logic for predicting availability
  const predictions = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  days.forEach(day => {
    const isPeakDay = historicalData.peakDays.includes(day);
    const baseAvailability = isPeakDay ? 0.3 : 0.7; // 30% available on peak days
    
    predictions.push({
      day,
      predictedAvailability: baseAvailability,
      recommendedAction: isPeakDay ? 'Book in advance' : 'Flexible timing available',
      confidence: 0.85
    });
  });
  
  return predictions;
}

function getOptimalBookingTimes(predictions) {
  return predictions
    .filter(p => p.predictedAvailability > 0.5)
    .map(p => p.day)
    .slice(0, 3);
}

async function validateBookingData(bookingData) {
  const errors = [];
  
  if (!bookingData.email || !isValidEmail(bookingData.email)) {
    errors.push('Valid email is required');
  }
  
  if (!bookingData.phone || !isValidPhone(bookingData.phone)) {
    errors.push('Valid phone number is required');
  }
  
  if (!bookingData.date || new Date(bookingData.date) < new Date()) {
    errors.push('Booking date must be in the future');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[+]?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
}

async function checkBookingConflicts(bookingData) {
  const conflicts = await SmartBooking.find({
    date: new Date(bookingData.date),
    stylist: bookingData.stylist,
    status: { $in: ['pending', 'confirmed'] },
    _id: { $ne: bookingData._id }
  });
  
  return conflicts.filter(conflict => {
    const bookingTime = conflict.time;
    const newBookingTime = bookingData.time;
    const bookingEnd = addMinutesToTime(bookingTime, conflict.duration || 60);
    const newBookingEnd = addMinutesToTime(newBookingTime, bookingData.duration || 60);
    
    return (newBookingTime >= bookingTime && newBookingTime < bookingEnd) || 
           (newBookingEnd > bookingTime && newBookingEnd <= bookingEnd);
  });
}

async function calculatePredictedWaitTime(bookingData) {
  // Calculate predicted wait time based on historical data
  const similarBookings = await SmartBooking.find({
    service: bookingData.service,
    stylist: bookingData.stylist,
    date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
  });
  
  if (similarBookings.length === 0) return 15; // Default 15 minutes
  
  const averageWait = similarBookings.reduce((sum, booking) => 
    sum + (booking.actualWaitTime || booking.aiPredictedWaitTime || 15), 0) / similarBookings.length;
  
  return Math.round(averageWait);
}

function getStylistAvailability(stylist, date) {
  // Get stylist's working hours for the day
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayHours = stylist.workingHours[dayName];
  
  if (!todayHours) return { available: false, reason: 'Not working today' };
  
  // Check existing bookings for today
  return {
    available: true,
    workingHours: todayHours,
    nextAvailable: calculateNextAvailable(stylist, date)
  };
}

async function sendBookingConfirmation(booking) {
  // Email configuration would come from environment variables
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.email,
    subject: 'Booking Confirmation - JMK Beauty Salon',
    html: generateBookingConfirmationEmail(booking)
  };
  
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
  }
}

function generateBookingConfirmationEmail(booking) {
  return `
    <h2>Booking Confirmation</h2>
    <p>Dear ${booking.customerName},</p>
    <p>Your appointment has been confirmed:</p>
    <ul>
      <li><strong>Service:</strong> ${booking.service?.name || 'N/A'}</li>
      <li><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${booking.time}</li>
      <li><strong>Stylist:</strong> ${booking.stylist?.name || 'Any available'}</li>
      <li><strong>Price:</strong> ₹${booking.totalPrice}</li>
    </ul>
    <p>Please arrive 10 minutes before your appointment time.</p>
    <p>Thank you for choosing JMK Beauty Salon!</p>
  `;
}

// Additional helper functions for analytics
async function generateBookingAnalytics(startDate, endDate) {
  const matchStage = {
    date: { $gte: new Date(startDate), $lte: new Date(endDate) }
  };
  
  const bookings = await SmartBooking.find(matchStage);
  
  return {
    totalBookings: bookings.length,
    revenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
    averageBookingValue: bookings.length > 0 ? bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length : 0,
    cancellationRate: (bookings.filter(b => b.status === 'cancelled').length / bookings.length) * 100,
    popularServices: await getPopularServices(startDate, endDate),
    customerRetention: await calculateCustomerRetention(startDate, endDate)
  };
}

function calculateCancellationRate(bookings) {
  if (bookings.length === 0) return 0;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  return (cancelledBookings.length / bookings.length) * 100;
}

function calculatePeakHours(bookings) {
  const hourCounts = {};
  
  bookings.forEach(booking => {
    const hour = new Date(booking.date).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const maxCount = Math.max(...Object.values(hourCounts));
  return Object.keys(hourCounts).filter(hour => hourCounts[hour] === maxCount);
}

function calculatePeakDays(bookings) {
  const dayCounts = {};
  
  bookings.forEach(booking => {
    const day = new Date(booking.date).getDay();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  const maxCount = Math.max(...Object.values(dayCounts));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return Object.keys(dayCounts)
    .filter(day => dayCounts[day] === maxCount)
    .map(day => dayNames[day]);
}

function calculateAverageWaitTime(bookings) {
  const bookingsWithWaitTime = bookings.filter(b => b.actualWaitTime || b.aiPredictedWaitTime);
  if (bookingsWithWaitTime.length === 0) return 15;
  
  const totalWaitTime = bookingsWithWaitTime.reduce((sum, booking) => 
    sum + (booking.actualWaitTime || booking.aiPredictedWaitTime || 15), 0
  );
  
  return Math.round(totalWaitTime / bookingsWithWaitTime.length);
}

async function getPopularServices(startDate, endDate) {
  // This would aggregate service popularity
  // For now, return a placeholder
  return [
    { serviceName: 'Hair Cutting', bookings: 45 },
    { serviceName: 'Facial Treatment', bookings: 32 },
    { serviceName: 'Makeup', bookings: 28 }
  ];
}

async function calculateCustomerRetention(startDate, endDate) {
  // This would calculate customer retention rates
  // For now, return a placeholder
  return {
    newCustomers: 12,
    returningCustomers: 45,
    retentionRate: 78.9
  };
}

module.exports = router;

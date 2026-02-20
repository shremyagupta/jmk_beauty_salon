const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');
const axios = require('axios');
const twilio = require('twilio');
const { authenticateToken, authorizeRoles } = require('../middleware/adminAuth');

// Setup nodemailer transporter if email env vars are provided
let mailTransporter = null;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  console.warn('Email credentials not configured. Appointment emails will not be sent.');
}

let smsClient = null;
if (
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_PHONE_NUMBER
) {
  smsClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} else {
  console.warn('SMS credentials not configured. Appointment SMS messages will not be sent.');
}

const sendSmsNotification = async (phone, body) => {
  if (!smsClient || !phone) {
    return;
  }

  try {
    await smsClient.messages.create({
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      body
    });
  } catch (err) {
    console.error('SMS notification failed:', err.message);
  }
};

// Create appointment (optionally linked to logged-in user)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, date, time, message, requestedServices } = req.body;

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      time: time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        error: 'This time slot is already booked. Please choose another time.' 
      });
    }

    const appointment = new Appointment({
      name,
      email,
      phone,
      service,
      date: new Date(date),
      time,
      message: message || '',
      status: 'pending',
      requestedServices: Array.isArray(requestedServices) ? requestedServices : []
    });

    await appointment.save();
    // Send notification to admin (email + optional webhook)
    try {
      if (mailTransporter && process.env.ADMIN_EMAIL) {
        const adminMail = {
          from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `New appointment request: ${service} on ${date} ${time}`,
          text: `New appointment request:\n\nName: ${name}\nEmail: ${email || 'N/A'}\nPhone: ${phone || 'N/A'}\nService: ${service}\nDate: ${date}\nTime: ${time}\nMessage: ${message || ''}\n\nView in admin panel to confirm.`
        };
        await mailTransporter.sendMail(adminMail);
      }

      // Optional webhook (Slack/Telegram/etc.)
      if (process.env.NOTIFY_WEBHOOK_URL) {
        axios.post(process.env.NOTIFY_WEBHOOK_URL, {
          type: 'appointment_created',
          appointment: {
            id: appointment._id,
            name, email, phone, service, date, time, message,
            requestedServices: appointment.requestedServices || []
          }
        }).catch(err => console.error('Webhook notify failed', err.message));
      }

      // Confirmation email to client (if email provided)
      if (mailTransporter && email) {
        const clientMail = {
          from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
          to: email,
          subject: 'Appointment request received',
          text: `Hi ${name},\n\nThanks for requesting an appointment for ${service} on ${date} at ${time}. We have received your request and will confirm shortly.\n\n- ${process.env.BUSINESS_NAME || 'The Team'}`
        };
        mailTransporter.sendMail(clientMail).catch(err => console.error('Client mail failed', err.message));
      }

      await sendSmsNotification(
        phone,
        `Hi ${name}, we received your request for ${service} on ${date} at ${time}. We'll confirm shortly.`
      );
    } catch (notifyErr) {
      console.error('Appointment notification error:', notifyErr.message);
    }

    res.status(201).json({ 
      message: 'Appointment requested successfully! We will confirm your appointment soon.',
      appointment 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all appointments (Admin only)
router.get('/', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }
    const appointments = await Appointment.find(query).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get appointment by ID (Admin only)
router.get('/:id', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appointment (Admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const previousStatus = appointment.status;

    Object.assign(appointment, req.body);
    await appointment.save();

    // If status just changed to confirmed, send confirmation email to client
    if (
      mailTransporter &&
      appointment.email &&
      previousStatus !== 'confirmed' &&
      appointment.status === 'confirmed'
    ) {
      const confirmMail = {
        from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
        to: appointment.email,
        subject: 'Your appointment is confirmed',
        text: `Hi ${appointment.name},\n\nYour appointment for ${appointment.service || 'your selected service'} on ${appointment.date.toDateString()} at ${appointment.time} has been confirmed.\n\nWe look forward to seeing you!\n\n- ${process.env.BUSINESS_NAME || 'The Team'}`
      };

      mailTransporter.sendMail(confirmMail).catch(err => {
        console.error('Status confirm mail failed', err.message);
      });
    }

    if (
      previousStatus !== 'confirmed' &&
      appointment.status === 'confirmed'
    ) {
      await sendSmsNotification(
        appointment.phone,
        `Hi ${appointment.name}, your appointment for ${appointment.service || 'your selected service'} on ${appointment.date.toDateString()} at ${appointment.time} is confirmed.`
      );
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete appointment (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;





const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Setup nodemailer transporter if SMTP env vars are provided
let mailTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, date, time, message } = req.body;

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
      status: 'pending'
    });

    await appointment.save();
    // Send notification to admin (email + optional webhook)
    try {
      if (mailTransporter && process.env.ADMIN_EMAIL) {
        const adminMail = {
          from: process.env.FROM_EMAIL || process.env.SMTP_USER,
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
            name, email, phone, service, date, time, message
          }
        }).catch(err => console.error('Webhook notify failed', err.message));
      }

      // Confirmation email to client (if email provided)
      if (mailTransporter && email) {
        const clientMail = {
          from: process.env.FROM_EMAIL || process.env.SMTP_USER,
          to: email,
          subject: 'Appointment request received',
          text: `Hi ${name},\n\nThanks for requesting an appointment for ${service} on ${date} at ${time}. We have received your request and will confirm shortly.\n\n- ${process.env.BUSINESS_NAME || 'The Team'}`
        };
        mailTransporter.sendMail(clientMail).catch(err => console.error('Client mail failed', err.message));
      }
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
router.get('/', async (req, res) => {
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

// Get appointment by ID
router.get('/:id', async (req, res) => {
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

// Update appointment
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
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





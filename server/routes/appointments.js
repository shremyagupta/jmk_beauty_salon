const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

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


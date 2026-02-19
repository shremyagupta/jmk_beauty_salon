const express = require('express');
const ServiceInterest = require('../models/ServiceInterest');

const router = express.Router();

// Create a new service interest (guest-friendly)
router.post('/', async (req, res) => {
  try {
    const { requestedServices, note, name, email, phone } = req.body;

    if (!Array.isArray(requestedServices) || requestedServices.length === 0) {
      return res.status(400).json({ error: 'Please select at least one service' });
    }

    const interest = new ServiceInterest({
      requestedServices,
      note: note || '',
      name: name || '',
      email: email || '',
      phone: phone || ''
    });

    await interest.save();

    res.status(201).json({
      message: 'Your service preferences have been saved.',
      interest
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;



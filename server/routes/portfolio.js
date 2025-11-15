const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// Get all portfolio items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    const portfolio = await Portfolio.find(query).sort({ order: 1, createdAt: -1 });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get portfolio item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured portfolio items
router.get('/featured/all', async (req, res) => {
  try {
    const featured = await Portfolio.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create portfolio item (Admin only)
router.post('/', async (req, res) => {
  try {
    const portfolio = new Portfolio(req.body);
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update portfolio item
router.put('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete portfolio item
router.delete('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


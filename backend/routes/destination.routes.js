const express = require('express');
const DestinationModel = require('../models/destination.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Get all destinations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const destinations = await DestinationModel.findAll();
    res.json({ destinations });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search destinations
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const destinations = await DestinationModel.searchByName(q);
    res.json({ destinations });
  } catch (error) {
    console.error('Search destinations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new destination (admin function)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, state, city, pincode } = req.body;
    
    if (!name || !state || !city || !pincode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const destId = await DestinationModel.create({ name, state, city, pincode });
    res.status(201).json({ message: 'Destination created successfully', destId });
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


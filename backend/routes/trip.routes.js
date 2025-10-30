const express = require('express');
const TripModel = require('../models/trip.model');
const DestinationModel = require('../models/destination.model');
const TransportModel = require('../models/transport.model');
const RideFareModel = require('../models/ridefare.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Get all trips for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const trips = await TripModel.findByUserId(req.userId);
    res.json({ trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single trip by ID
router.get('/:tripId', authMiddleware, async (req, res) => {
  try {
    const trip = await TripModel.findById(req.params.tripId, req.userId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ trip });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a trip
router.delete('/:tripId', authMiddleware, async (req, res) => {
  try {
    const success = await TripModel.delete(req.params.tripId, req.userId);
    if (!success) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new trip (with optimization)
router.post('/optimize', authMiddleware, async (req, res) => {
  try {
    const { source_id, dest_id, cost_weight = 0.4, time_weight = 0.3, comfort_weight = 0.3 } = req.body;
    
    // Convert snake_case to camelCase for consistency
    const costWeight = cost_weight;
    const timeWeight = time_weight;
    const comfortWeight = comfort_weight;

    if (!source_id || !dest_id) {
      return res.status(400).json({ message: 'Source and destination are required' });
    }

    // Get transport options for this route
    const transportOptions = await TransportModel.findByRoute(source_id, dest_id);
    
    if (transportOptions.length === 0) {
      return res.status(404).json({ message: 'No transport options available for this route' });
    }

    // Get ride fares for each transport option
    const optionsWithFares = await Promise.all(
      transportOptions.map(async (transport) => {
        const rideFares = await RideFareModel.findByTransportId(transport.trans_id);
        const cheapestFare = rideFares.length > 0 ? rideFares[0] : null;
        
        return {
          ...transport,
          rideFares,
          cheapestFare
        };
      })
    );

    // Calculate normalized scores (0-100 scale)
    const normalizedOptions = optionsWithFares.map(option => {
      const actualCost = option.cheapestFare ? option.cheapestFare.fare : option.base_cost;
      const actualTime = option.cheapestFare ? option.cheapestFare.estimated_time : option.duration;
      
      return {
        ...option,
        actualCost: parseFloat(actualCost) || 0,
        actualTime: parseInt(actualTime) || 0,
        comfort: parseInt(option.comfort_level) || 0
      };
    });

    // Find min/max for normalization
    const costs = normalizedOptions.map(o => o.actualCost);
    const times = normalizedOptions.map(o => o.actualTime);
    const comforts = normalizedOptions.map(o => o.comfort);
    
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const minComfort = Math.min(...comforts);
    const maxComfort = Math.max(...comforts);

    // Calculate composite score (lower is better for cost/time, higher is better for comfort)
    const scoredOptions = normalizedOptions.map(option => {
      const costScore = maxCost !== minCost ? 100 * (1 - (option.actualCost - minCost) / (maxCost - minCost)) : 100;
      const timeScore = maxTime !== minTime ? 100 * (1 - (option.actualTime - minTime) / (maxTime - minTime)) : 100;
      const comfortScore = maxComfort !== minComfort ? 100 * (option.comfort - minComfort) / (maxComfort - minComfort) : 100;
      
      const compositeScore = costWeight * costScore + timeWeight * timeScore + comfortWeight * comfortScore;
      
      return {
        ...option,
        costScore,
        timeScore,
        comfortScore,
        compositeScore
      };
    });

    // Sort by composite score
    scoredOptions.sort((a, b) => b.compositeScore - a.compositeScore);
    
    const bestOption = scoredOptions[0];
    
    // Create trip entry
    const tripData = {
      user_id: req.userId,
      source_id,
      dest_id,
      selected_mode: bestOption.mode,
      total_cost: bestOption.actualCost,
      total_duration: bestOption.actualTime,
      comfort_score: bestOption.comfort
    };

    const tripId = await TripModel.create(tripData);

    // Get destination names
    const sourceDest = await DestinationModel.findById(source_id);
    const destDest = await DestinationModel.findById(dest_id);

    res.status(201).json({
      message: 'Optimized route generated successfully',
      tripId,
      recommendation: {
        mode: bestOption.mode,
        appName: bestOption.cheapestFare ? bestOption.cheapestFare.app_name : 'Direct',
        totalCost: bestOption.actualCost,
        totalDuration: bestOption.actualTime,
        comfort: bestOption.comfort,
        score: isNaN(bestOption.compositeScore) ? '0.00' : bestOption.compositeScore.toFixed(2),
        source: sourceDest,
        destination: destDest
      },
      allOptions: scoredOptions.map(o => ({
        mode: o.mode,
        appName: o.cheapestFare ? o.cheapestFare.app_name : 'Direct',
        cost: o.actualCost,
        duration: o.actualTime,
        comfort: o.comfort,
        score: isNaN(o.compositeScore) ? '0.00' : o.compositeScore.toFixed(2),
        rides: o.rideFares
      }))
    });
  } catch (error) {
    console.error('Optimize trip error:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


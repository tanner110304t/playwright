const express = require('express');
const router = express.Router();
const sensors = require('../data/sensors');

// GET /api/sensors
// Returns all sensors
router.get('/', function(req, res) {
  res.json({
    success: true,
    count: sensors.length,
    data: sensors
  });
});

// GET /api/sensors/:id
// Returns a single sensor by ID
router.get('/:id', function(req, res) {
  const sensor = sensors.find(function(s) {
    return s.id === req.params.id;
  });

  if (!sensor) {
    return res.status(404).json({
      success: false,
      error: 'Sensor not found'
    });
  }

  res.json({
    success: true,
    data: sensor
  });
});

// POST /api/sensors/reading
// Submits a new reading for a sensor
router.post('/reading', function(req, res) {
  const sensorId = req.body.sensorId;
  const value = req.body.value;

  // Check that both fields were provided
  if (!sensorId || value === undefined) {
    return res.status(400).json({
      success: false,
      error: 'sensorId and value are required'
    });
  }

  // Check that value is a number
  if (isNaN(value)) {
    return res.status(400).json({
      success: false,
      error: 'Reading value must be a number'
    });
  }

  // Find the sensor
  const sensor = sensors.find(function(s) {
    return s.id === sensorId;
  });

  if (!sensor) {
    return res.status(404).json({
      success: false,
      error: 'Sensor not found'
    });
  }

  // Update the sensor value
  sensor.value = Number(value);

  res.json({
    success: true,
    message: 'Reading submitted successfully',
    data: sensor
  });
});

module.exports = router;
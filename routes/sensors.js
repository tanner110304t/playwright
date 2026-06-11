const express = require('express');
const router = express.Router();
const sensorData = require('../data/sensors');

// GET /api/sensors - return all sensors
router.get('/', function(req, res) {
  var sensors = sensorData.getSensors();
  res.json({
    success: true,
    count: sensors.length,
    data: sensors
  });
});

// GET /api/sensors/:id - return a single sensor by id
router.get('/:id', function(req, res) {
  var sensors = sensorData.getSensors();
  var sensor = sensors.find(function(s) {
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

// POST /api/sensors/reading - submit a new reading
router.post('/reading', function(req, res) {
  var sensors = sensorData.getSensors();
  var sensorId = req.body.sensorId;
  var value = req.body.value;

  // sensorId must be present and not just whitespace
  if (sensorId === undefined || sensorId === null || String(sensorId).trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'sensorId is required'
    });
  }

  // value must be present (note: 0 is allowed, so check explicitly)
  if (value === undefined || value === null || value === '') {
    return res.status(400).json({
      success: false,
      error: 'value is required'
    });
  }

  // value must be a number (rejects 'abc', empty objects, etc.)
  if (isNaN(value)) {
    return res.status(400).json({
      success: false,
      error: 'Reading value must be a number'
    });
  }

  // value must be within a realistic range
  var numericValue = Number(value);
  if (numericValue < -100 || numericValue > 10000) {
    return res.status(400).json({
      success: false,
      error: 'Reading value must be between -100 and 10000'
    });
  }

  // find the sensor (trim the id so trailing spaces still match)
  var cleanId = String(sensorId).trim();
  var sensor = sensors.find(function(s) {
    return s.id === cleanId;
  });

  if (!sensor) {
    return res.status(404).json({
      success: false,
      error: 'Sensor not found'
    });
  }

  // update the sensor value
  sensor.value = numericValue;

  res.json({
    success: true,
    message: 'Reading submitted successfully',
    data: sensor
  });
});

module.exports = router;
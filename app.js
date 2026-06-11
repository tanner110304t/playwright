const express = require('express');
const path = require('path');
const sensorRoutes = require('./routes/sensors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/sensors', sensorRoutes);

// Health check
app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', message: 'Environmental Monitor API is running' });
});

module.exports = app;
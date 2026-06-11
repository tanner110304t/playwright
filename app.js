const express = require('express');
const path = require('path');
const sensorsRoutes = require('./routes/sensors');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/sensors', sensorsRoutes);

app.get('/api/health', function(req, res){
    res.json({ status: 'ok', message: 'Environmental Monitor API is functional' });
});

module.exports = app
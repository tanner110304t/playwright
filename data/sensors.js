// Mock sensor data - the single source of truth for the app.
// We export a factory that returns a FRESH COPY every time it is called.
// This prevents tests and requests from permanently mutating shared data.

// The original, untouched seed data. Never exported directly.
const seedSensors = [
  { id: 'sensor-001', location: 'Phoenix', type: 'air_quality', value: 42, unit: 'AQI', status: 'active' },
  { id: 'sensor-002', location: 'Seattle', type: 'air_quality', value: 18, unit: 'AQI', status: 'active' },
  { id: 'sensor-003', location: 'Denver', type: 'temperature', value: 72, unit: 'F', status: 'active' }
];

// The live working copy that the API reads and writes.
let sensors = cloneSeed();

// Make a deep-enough copy of the seed data (objects are simple and flat).
function cloneSeed() {
  return seedSensors.map(function(sensor) {
    return Object.assign({}, sensor);
  });
}

// Return the current live sensors.
function getSensors() {
  return sensors;
}

// Reset the live data back to the original seed values.
// Tests call this before each test so every test starts clean.
function resetSensors() {
  sensors = cloneSeed();
}

module.exports = {
  getSensors: getSensors,
  resetSensors: resetSensors
};
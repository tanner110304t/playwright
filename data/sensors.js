// Mock sensor data - single source of truth for the whole app
// All sensor types use underscore_case for consistency

const sensors = [
  {
    id: 'sensor-001',
    location: 'Phoenix',
    type: 'air_quality',
    value: 42,
    unit: 'AQI',
    status: 'active'
  },
  {
    id: 'sensor-002',
    location: 'Seattle',
    type: 'air_quality',
    value: 18,
    unit: 'AQI',
    status: 'active'
  },
  {
    id: 'sensor-003',
    location: 'Denver',
    type: 'temperature',
    value: 72,
    unit: 'F',
    status: 'active'
  }
];

module.exports = sensors;
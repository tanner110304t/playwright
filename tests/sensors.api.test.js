const request = require('supertest');
const app = require('../app');
const sensorData = require('../data/sensors');

// Reset the sensor data before every test so tests never affect each other.
beforeEach(function() {
  sensorData.resetSensors();
});

// Health check
describe('GET /api/health', function() {
  it('should return status ok', function(done) {
    request(app)
      .get('/api/health')
      .expect(200)
      .expect(function(res) {
        if (res.body.status !== 'ok') throw new Error('Expected status ok');
      })
      .end(done);
  });
});

// Get all sensors
describe('GET /api/sensors', function() {
  it('should return all three sensors', function(done) {
    request(app)
      .get('/api/sensors')
      .expect(200)
      .expect(function(res) {
        if (res.body.success !== true) throw new Error('Expected success true');
        if (!Array.isArray(res.body.data)) throw new Error('Expected data array');
        if (res.body.data.length !== 3) throw new Error('Expected 3 sensors');
        if (res.body.count !== 3) throw new Error('Expected count 3');
      })
      .end(done);
  });

  it('should return sensors with all required fields', function(done) {
    request(app)
      .get('/api/sensors')
      .expect(200)
      .expect(function(res) {
        var sensor = res.body.data[0];
        if (!sensor.id) throw new Error('Missing id');
        if (!sensor.location) throw new Error('Missing location');
        if (!sensor.type) throw new Error('Missing type');
        if (sensor.value === undefined) throw new Error('Missing value');
        if (!sensor.unit) throw new Error('Missing unit');
        if (!sensor.status) throw new Error('Missing status');
      })
      .end(done);
  });

  it('should always return original seed values (proves data reset works)', function(done) {
    request(app)
      .get('/api/sensors')
      .expect(200)
      .expect(function(res) {
        var phoenix = res.body.data.find(function(s) { return s.id === 'sensor-001'; });
        if (phoenix.value !== 42) throw new Error('Expected seed value 42');
      })
      .end(done);
  });
});

// Get sensor by id
describe('GET /api/sensors/:id', function() {
  it('should return a single sensor by id', function(done) {
    request(app)
      .get('/api/sensors/sensor-001')
      .expect(200)
      .expect(function(res) {
        if (res.body.success !== true) throw new Error('Expected success true');
        if (res.body.data.id !== 'sensor-001') throw new Error('Expected sensor-001');
        if (res.body.data.location !== 'Phoenix') throw new Error('Expected Phoenix');
      })
      .end(done);
  });

  it('should return 404 for unknown sensor id', function(done) {
    request(app)
      .get('/api/sensors/sensor-999')
      .expect(404)
      .expect(function(res) {
        if (res.body.success !== false) throw new Error('Expected success false');
        if (!res.body.error) throw new Error('Expected error message');
      })
      .end(done);
  });
});

// Post reading - happy path
describe('POST /api/sensors/reading - valid input', function() {
  it('should accept a valid reading', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: 55 })
      .expect(200)
      .expect(function(res) {
        if (res.body.success !== true) throw new Error('Expected success true');
        if (res.body.data.value !== 55) throw new Error('Expected value 55');
      })
      .end(done);
  });

  it('should accept zero as a valid reading', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: 0 })
      .expect(200)
      .expect(function(res) {
        if (res.body.data.value !== 0) throw new Error('Expected value 0');
      })
      .end(done);
  });

  it('should accept the lower boundary value -100', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: -100 })
      .expect(200)
      .expect(function(res) {
        if (res.body.data.value !== -100) throw new Error('Expected -100');
      })
      .end(done);
  });

  it('should accept the upper boundary value 10000', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: 10000 })
      .expect(200)
      .expect(function(res) {
        if (res.body.data.value !== 10000) throw new Error('Expected 10000');
      })
      .end(done);
  });

  it('should accept a numeric string value', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: '88' })
      .expect(200)
      .expect(function(res) {
        if (res.body.data.value !== 88) throw new Error('Expected number 88');
      })
      .end(done);
  });

  it('should trim a sensorId with surrounding spaces', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: '  sensor-001  ', value: 33 })
      .expect(200)
      .expect(function(res) {
        if (res.body.data.id !== 'sensor-001') throw new Error('Expected trimmed match');
      })
      .end(done);
  });
});

// Post reading - negative and boundary paths
describe('POST /api/sensors/reading - invalid input', function() {
  it('should return 404 for unknown sensor id', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-999', value: 55 })
      .expect(404)
      .expect(function(res) {
        if (res.body.success !== false) throw new Error('Expected success false');
        if (res.body.error !== 'Sensor not found') throw new Error('Expected not found message');
      })
      .end(done);
  });

  it('should return 400 for missing sensorId', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ value: 55 })
      .expect(400)
      .expect(function(res) {
        if (res.body.error !== 'sensorId is required') throw new Error('Expected sensorId required');
      })
      .end(done);
  });

  it('should return 400 for a whitespace-only sensorId', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: '   ', value: 55 })
      .expect(400)
      .expect(function(res) {
        if (res.body.error !== 'sensorId is required') throw new Error('Expected sensorId required');
      })
      .end(done);
  });

  it('should return 400 for missing value', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001' })
      .expect(400)
      .expect(function(res) {
        if (res.body.error !== 'value is required') throw new Error('Expected value required');
      })
      .end(done);
  });

  it('should return 400 for an empty string value', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: '' })
      .expect(400)
      .expect(function(res) {
        if (res.body.error !== 'value is required') throw new Error('Expected value required');
      })
      .end(done);
  });

  it('should return 400 for a non-numeric value', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: 'abc' })
      .expect(400)
      .expect(function(res) {
        if (res.body.error !== 'Reading value must be a number') throw new Error('Expected number message');
      })
      .end(done);
  });

  it('should return 400 for a value below the lower boundary', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: -101 })
      .expect(400)
      .expect(function(res) {
        if (res.body.success !== false) throw new Error('Expected success false');
      })
      .end(done);
  });

  it('should return 400 for a value above the upper boundary', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: 10001 })
      .expect(400)
      .expect(function(res) {
        if (res.body.success !== false) throw new Error('Expected success false');
      })
      .end(done);
  });
});
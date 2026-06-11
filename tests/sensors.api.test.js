const request = require('supertest');
const app = require('../app');

// Health check
describe('GET /api/health', function() {
  it('should return status ok', function(done) {
    request(app)
      .get('/api/health')
      .expect(200)
      .expect(function(res) {
        if (res.body.status !== 'ok') {
          throw new Error('Expected status to be ok');
        }
      })
      .end(done);
  });
});

// Get all sensors
describe('GET /api/sensors', function() {
  it('should return all sensors', function(done) {
    request(app)
      .get('/api/sensors')
      .expect(200)
      .expect(function(res) {
        if (res.body.success !== true) throw new Error('Expected success true');
        if (!Array.isArray(res.body.data)) throw new Error('Expected data array');
        if (res.body.data.length !== 3) throw new Error('Expected 3 sensors');
      })
      .end(done);
  });

  it('should return sensors with required fields', function(done) {
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

// Post reading
describe('POST /api/sensors/reading', function() {
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

  it('should return 404 for unknown sensor id', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-999', value: 55 })
      .expect(404)
      .expect(function(res) {
        if (res.body.success !== false) throw new Error('Expected success false');
      })
      .end(done);
  });

  it('should return 400 for missing sensorId', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ value: 55 })
      .expect(400)
      .expect(function(res) {
        if (res.body.success !== false) throw new Error('Expected success false');
      })
      .end(done);
  });

  it('should return 400 for missing value', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001' })
      .expect(400)
      .expect(function(res) {
        if (res.body.success !== false) throw new Error('Expected success false');
      })
      .end(done);
  });

  it('should return 400 for non-numeric value', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: 'abc' })
      .expect(400)
      .expect(function(res) {
        if (res.body.success !== false) throw new Error('Expected success false');
        if (res.body.error !== 'Reading value must be a number') {
          throw new Error('Expected specific error message');
        }
      })
      .end(done);
  });

  it('should return 400 for value out of range', function(done) {
    request(app)
      .post('/api/sensors/reading')
      .send({ sensorId: 'sensor-001', value: 99999 })
      .expect(400)
      .expect(function(res) {
        if (res.body.success !== false) throw new Error('Expected success false');
      })
      .end(done);
  });
});
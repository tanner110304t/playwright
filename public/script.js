function loadSensors() {
  var container = document.getElementById('sensors-container');

  fetch('/api/sensors')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        displaySensors(data.data);
      } else {
        container.innerHTML = '<p>Failed to load sensors.</p>';
      }
    })
    .catch(function(error) {
      container.innerHTML = '<p>Error connecting to API.</p>';
      console.error('loadSensors error:', error);
    });
}

// =====================
// BUILD SENSOR CARDS
// =====================

function displaySensors(sensors) {
  var container = document.getElementById('sensors-container');

  if (sensors.length === 0) {
    container.innerHTML = '<p>No sensors found.</p>';
    return;
  }

  container.innerHTML = '';

  sensors.forEach(function(sensor) {
    var card = document.createElement('div');
    card.className = 'sensor-card';
    card.setAttribute('data-sensor-id', sensor.id);

    card.innerHTML =
      '<h3>' + sensor.location + '</h3>' +
      '<div class="sensor-value">' + sensor.value + '</div>' +
      '<div class="sensor-unit">' + sensor.unit + '</div>' +
      '<div class="sensor-id">' + sensor.id + '</div>' +
      '<div class="sensor-status">' + sensor.status + '</div>';

    container.appendChild(card);
  });
}

// =====================
// SUBMIT A NEW READING
// =====================

function submitReading() {
  var sensorId = document.getElementById('sensor-id-input').value.trim();
  var value = document.getElementById('reading-value-input').value.trim();
  var button = document.getElementById('submit-reading-btn');
  var messageContainer = document.getElementById('message-container');

  // Clear any previous message
  messageContainer.innerHTML = '';
  messageContainer.className = '';

  // Basic frontend validation
  if (!sensorId || !value) {
    showMessage('Please fill in both fields.', 'error');
    return;
  }

  // Disable button while request is in progress
  button.disabled = true;
  button.textContent = 'Submitting...';

  fetch('/api/sensors/reading', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sensorId: sensorId,
      value: value
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        showMessage('Reading submitted successfully for ' + sensorId + '.', 'success');
        loadSensors();
      } else {
        showMessage(data.error || 'Something went wrong.', 'error');
      }
    })
    .catch(function(error) {
      showMessage('Error connecting to API.', 'error');
      console.error('submitReading error:', error);
    })
    .finally(function() {
      button.disabled = false;
      button.textContent = 'Submit Reading';
    });
}

// =====================
// SHOW SUCCESS OR ERROR MESSAGE
// =====================

function showMessage(text, type) {
  var messageContainer = document.getElementById('message-container');
  messageContainer.textContent = text;
  messageContainer.className = type === 'success' ? 'success-message' : 'error-message';
}

// =====================
// WIRE UP THE BUTTON
// =====================

document.getElementById('submit-reading-btn').addEventListener('click', submitReading);

// =====================
// RUN ON PAGE LOAD
// =====================

loadSensors();
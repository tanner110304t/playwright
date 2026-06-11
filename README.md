# Environmental Sensor Dashboard

A beginner-friendly Quality Engineering and Testing (QET) project built with Node.js, Express, and Playwright. It demonstrates API testing, end-to-end browser testing, and an automated CI pipeline.

## What This Project Demonstrates

- A REST API built with Express serving mock environmental sensor data
- A static frontend dashboard that reads from and writes to the API
- API integration tests using Jest and Supertest
- End-to-end browser tests using Playwright
- An automated CI pipeline using GitHub Actions

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Frontend | HTML, CSS, Vanilla JavaScript |
| API Tests | Jest, Supertest |
| E2E Tests | Playwright |
| CI | GitHub Actions |

## Project Structure
.github/workflows/   GitHub Actions CI pipeline
data/                Mock sensor data
e2e/                 Playwright end-to-end tests
public/              Frontend dashboard (HTML, CSS, JS)
routes/              Express API route handlers
tests/               Jest + Supertest API tests
app.js               Express app configuration
server.js            Server entry point
playwright.config.js Playwright configuration

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/sensors | Get all sensors |
| GET | /api/sensors/:id | Get a sensor by ID |
| POST | /api/sensors/reading | Submit a new reading |

## Getting Started

### Install dependencies

```bash
npm install
npx playwright install
```

### Run the server

```bash
npm start
```

Open http://localhost:3000 in your browser.

### Run API tests

```bash
npm test
```

### Run Playwright e2e tests

```bash
npm run test:e2e
```

### Run all tests

```bash
npm run test:all
```

## Testing Approach

This project covers two layers of the testing pyramid:

- **API tests (Jest + Supertest):** verify each endpoint returns the correct status codes, response shapes, and validation errors.
- **E2E tests (Playwright):** automate a real browser to verify the full user workflow — loading sensors, submitting readings, and seeing success or error messages.

## CI Pipeline

Every push to `main` automatically runs both the API tests and the Playwright tests via GitHub Actions. Failed Playwright runs upload screenshots and videos as artifacts for debugging.

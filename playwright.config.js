const { defineConfig } = require('@playwright/test');

// CI sets CI=true automatically, used to switch to headless fast mode
var isCI = process.env.CI === 'true';

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  workers: 1,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:3000',
    // headless in CI, visible locally so you can watch tests run
    headless: isCI ? true : false,
    // no slow motion in CI, slowed down locally for visibility
    slowMo: isCI ? 0 : 1000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 }
  },

  // Playwright starts the server automatically before running tests
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 10000
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium'
      }
    }
  ]
});
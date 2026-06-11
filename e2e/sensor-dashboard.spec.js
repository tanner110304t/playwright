const { test, expect } = require('@playwright/test');

test.describe('Environmental Sensor Dashboard', function() {

  // Navigate to a fresh page before each test
  test.beforeEach(async function({ page }) {
    await page.goto('/');
  });

  // Page loads
  test('should display dashboard title', async function({ page }) {
    await expect(page).toHaveTitle('Environmental Sensor Dashboard');
  });

  test('should display the header text', async function({ page }) {
    const header = page.locator('h1');
    await expect(header).toBeVisible();
    await expect(header).toHaveText('Environmental Sensor Dashboard');
  });

  // Sensors display
  test('should display all three sensor cards', async function({ page }) {
    const cards = page.locator('.sensor-card');
    await expect(cards).toHaveCount(3);
  });

  test('should display Phoenix sensor card', async function({ page }) {
    const phoenixCard = page.locator('.sensor-card').filter({ hasText: 'Phoenix' });
    await expect(phoenixCard).toBeVisible();
  });

  test('should display Seattle sensor card', async function({ page }) {
    const seattleCard = page.locator('.sensor-card').filter({ hasText: 'Seattle' });
    await expect(seattleCard).toBeVisible();
  });

  test('should display sensor IDs on cards', async function({ page }) {
    await expect(page.locator('text=sensor-001')).toBeVisible();
    await expect(page.locator('text=sensor-002')).toBeVisible();
    await expect(page.locator('text=sensor-003')).toBeVisible();
  });

  // Valid submission
  test('should show success message after valid submission', async function({ page }) {
    await page.getByLabel('Sensor ID').fill('sensor-001');
    await page.getByLabel('Reading Value').fill('75');
    await page.getByRole('button', { name: 'Submit Reading' }).click();

    const message = page.locator('#message-container');
    await expect(message).toBeVisible({ timeout: 10000 });
    await expect(message).toHaveClass(/success-message/, { timeout: 10000 });
    await expect(message).toContainText('Reading submitted successfully');
  });

  test('should update sensor card value after valid submission', async function({ page }) {
    await page.getByLabel('Sensor ID').fill('sensor-001');
    await page.getByLabel('Reading Value').fill('99');
    await page.getByRole('button', { name: 'Submit Reading' }).click();

    await page.waitForTimeout(1000);

    const message = page.locator('#message-container');
    await expect(message).toBeVisible({ timeout: 10000 });
    await expect(message).toHaveClass(/success-message/, { timeout: 10000 });

    const phoenixCard = page.locator('.sensor-card').filter({ hasText: 'Phoenix' });
    await expect(phoenixCard).toContainText('99', { timeout: 10000 });
  });

  // Invalid sensor id
  test('should show error message for unknown sensor ID', async function({ page }) {
    await page.getByLabel('Sensor ID').fill('sensor-999');
    await page.getByLabel('Reading Value').fill('50');
    await page.getByRole('button', { name: 'Submit Reading' }).click();

    const message = page.locator('#message-container');
    await expect(message).toBeVisible({ timeout: 10000 });
    await expect(message).toHaveClass(/error-message/, { timeout: 10000 });
    await expect(message).toContainText('Sensor not found');
  });

  // Invalid value
  test('should show error message for non-numeric reading value', async function({ page }) {
    await page.getByLabel('Sensor ID').fill('sensor-001');
    await page.getByLabel('Reading Value').fill('abc');
    await page.getByRole('button', { name: 'Submit Reading' }).click();

    const message = page.locator('#message-container');
    await expect(message).toBeVisible({ timeout: 10000 });
    await expect(message).toHaveClass(/error-message/, { timeout: 10000 });
    await expect(message).toContainText('Reading value must be a number');
  });

  // Empty fields
  test('should show error message when fields are empty', async function({ page }) {
    await page.getByRole('button', { name: 'Submit Reading' }).click();

    const message = page.locator('#message-container');
    await expect(message).toBeVisible({ timeout: 10000 });
    await expect(message).toHaveClass(/error-message/, { timeout: 10000 });
    await expect(message).toContainText('Please fill in both fields');
  });

  // Message clears between submissions
  test('should clear previous message when new submission is made', async function({ page }) {
    await page.getByLabel('Sensor ID').fill('sensor-999');
    await page.getByLabel('Reading Value').fill('50');
    await page.getByRole('button', { name: 'Submit Reading' }).click();
    await expect(page.locator('#message-container')).toHaveClass(/error-message/, { timeout: 10000 });

    await page.getByLabel('Sensor ID').fill('sensor-001');
    await page.getByLabel('Reading Value').fill('60');
    await page.getByRole('button', { name: 'Submit Reading' }).click();

    const message = page.locator('#message-container');
    await expect(message).toHaveClass(/success-message/, { timeout: 10000 });
    await expect(message).not.toHaveClass(/error-message/);
  });

});
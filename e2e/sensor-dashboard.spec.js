const { test, expect } = require('@playwright/test');

// TEST SUITE

test.describe('Environmental Sensor Dashboard', function(){
    test.beforeEach(async function({ page }) {
        await page.goto('/');
    });

    // TEST 1 - Page Load

    test('should display dashboard title', async function({ page }) {
        await expect(page).toHaveTitle('Environmental Sensor Dashboard');
    });

    test('should display the header text', async function({ page }) {
    const header = page.locator('h1');
    await expect(header).toBeVisible();
    await expect(header).toHaveText('Environmental Sensor Dashboard');
  });

  // =====================
  // TEST 2: Sensors display
  // =====================

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

  // =====================
  // TEST 3: Valid reading submission
  // =====================

  test('should show success message after valid submission', async function({ page }) {
    // Type into the Sensor ID field
    await page.getByLabel('Sensor ID').fill('sensor-001');

    // Type into the Reading Value field
    await page.getByLabel('Reading Value').fill('75');

    // Click the submit button
    await page.getByRole('button', { name: 'Submit Reading' }).click();

    // Wait for and check the success message
    const message = page.locator('#message-container');
    await expect(message).toBeVisible();
    await expect(message).toHaveClass(/success-message/);
    await expect(message).toContainText('Reading submitted successfully');
  });

  test('should update sensor card value after valid submission', async function({ page }) {
    await page.getByLabel('Sensor ID').fill('sensor-001');
    await page.getByLabel('Reading Value').fill('99');

    await page.getByRole('button', { name: 'Submit Reading' }).click();

    // Wait for success message first
    await expect(page.locator('#message-container')).toHaveClass(/success-message/);

    // Then check the Phoenix card shows the new value
    const phoenixCard = page.locator('.sensor-card').filter({ hasText: 'Phoenix' });
    await expect(phoenixCard).toContainText('99');
  });

  // =====================
  // TEST 4: Invalid sensor ID
  // =====================

  test('should show error message for unknown sensor ID', async function({ page }) {
    await page.getByLabel('Sensor ID').fill('sensor-999');
    await page.getByLabel('Reading Value').fill('50');

    await page.getByRole('button', { name: 'Submit Reading' }).click();

    const message = page.locator('#message-container');
    await expect(message).toBeVisible();
    await expect(message).toHaveClass(/error-message/);
    await expect(message).toContainText('Sensor not found');
  });

  // =====================
  // TEST 5: Invalid reading value
  // =====================

  test('should show error message for non-numeric reading value', async function({ page }) {
    await page.getByLabel('Sensor ID').fill('sensor-001');
    await page.getByLabel('Reading Value').fill('abc');

    await page.getByRole('button', { name: 'Submit Reading' }).click();

    const message = page.locator('#message-container');
    await expect(message).toBeVisible();
    await expect(message).toHaveClass(/error-message/);
    await expect(message).toContainText('Reading value must be a number');
  });

  // =====================
  // TEST 6: Empty fields
  // =====================

  test('should show error message when fields are empty', async function({ page }) {
    // Click submit without filling anything in
    await page.getByRole('button', { name: 'Submit Reading' }).click();

    const message = page.locator('#message-container');
    await expect(message).toBeVisible();
    await expect(message).toHaveClass(/error-message/);
    await expect(message).toContainText('Please fill in both fields');
  });

  // =====================
  // TEST 7: Form behavior
  // =====================

  test('should clear previous message when new submission is made', async function({ page }) {
    // First submission - invalid
    await page.getByLabel('Sensor ID').fill('sensor-999');
    await page.getByLabel('Reading Value').fill('50');
    await page.getByRole('button', { name: 'Submit Reading' }).click();

    // Confirm error message appeared
    await expect(page.locator('#message-container')).toHaveClass(/error-message/);

    // Second submission - valid
    await page.getByLabel('Sensor ID').fill('sensor-001');
    await page.getByLabel('Reading Value').fill('60');
    await page.getByRole('button', { name: 'Submit Reading' }).click();

    // Error message should be gone, success message should appear
    const message = page.locator('#message-container');
    await expect(message).toHaveClass(/success-message/);
    await expect(message).not.toHaveClass(/error-message/);
  });
  
});
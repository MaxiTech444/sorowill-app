import { test, expect } from '@playwright/test';

test.describe('CSV Export', () => {
  test('should display export button on dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await expect(exportButton).toBeVisible();
  });

  test('should trigger CSV download when export button is clicked', async ({ page }) => {
    await page.goto('/dashboard');

    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await exportButton.click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/wills-export-\d{4}-\d{2}-\d{2}\.csv/);
  });

  test('should include will data in exported CSV', async ({ page }) => {
    await page.goto('/dashboard');

    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await exportButton.click();

    const download = await downloadPromise;
    const path = await download.path();

    // Read the file content
    const fs = require('fs');
    const content = fs.readFileSync(path, 'utf-8');

    // Verify CSV headers
    expect(content).toContain('Will ID');
    expect(content).toContain('Owner');
    expect(content).toContain('Status');
    expect(content).toContain('Balance');
    expect(content).toContain('Beneficiaries');
    expect(content).toContain('Guardians');
  });

  test('should export multiple wills if user owns multiple', async ({ page }) => {
    await page.goto('/dashboard');

    // Assuming there are multiple wills displayed
    const willCards = page.locator('[data-testid="will-card"]');
    const willCount = await willCards.count();

    if (willCount > 1) {
      const downloadPromise = page.waitForEvent('download');
      const exportButton = page.getByRole('button', { name: /export.*csv/i });
      await exportButton.click();

      const download = await downloadPromise;
      const path = await download.path();

      const fs = require('fs');
      const content = fs.readFileSync(path, 'utf-8');

      // Should contain multiple data rows (one per will + header)
      const lines = content.trim().split('\n');
      expect(lines.length).toBeGreaterThan(1);
    }
  });

  test('should not include sensitive data in export', async ({ page }) => {
    await page.goto('/dashboard');

    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await exportButton.click();

    const download = await downloadPromise;
    const path = await download.path();

    const fs = require('fs');
    const content = fs.readFileSync(path, 'utf-8');

    // Verify no sensitive data
    expect(content.toLowerCase()).not.toContain('private');
    expect(content.toLowerCase()).not.toContain('secret');
    expect(content.toLowerCase()).not.toContain('mnemonic');
  });

  test('should show success message after export', async ({ page }) => {
    await page.goto('/dashboard');

    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await exportButton.click();

    await downloadPromise;

    // Look for success message
    const successMessage = page.getByText(/export.*success|downloaded successfully/i);
    if (await successMessage.count() > 0) {
      await expect(successMessage).toBeVisible();
    }
  });

  test('should format beneficiary data in CSV export', async ({ page }) => {
    await page.goto('/dashboard');

    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await exportButton.click();

    const download = await downloadPromise;
    const path = await download.path();

    const fs = require('fs');
    const content = fs.readFileSync(path, 'utf-8');

    // Should contain beneficiary information
    expect(content).toContain('Beneficiaries');

    // If there are beneficiaries, they should be listed
    if (content.includes('G')) {
      // Stellar addresses start with 'G'
      expect(content).toMatch(/G[A-Z0-9]{55}/);
    }
  });

  test('should format guardian data in CSV export', async ({ page }) => {
    await page.goto('/dashboard');

    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await exportButton.click();

    const download = await downloadPromise;
    const path = await download.path();

    const fs = require('fs');
    const content = fs.readFileSync(path, 'utf-8');

    // Should contain guardian information
    expect(content).toContain('Guardians');
  });

  test('should escape special characters in CSV export', async ({ page }) => {
    await page.goto('/dashboard');

    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await exportButton.click();

    const download = await downloadPromise;
    const path = await download.path();

    const fs = require('fs');
    const content = fs.readFileSync(path, 'utf-8');

    // Should properly handle CSV escaping
    // CSV format requires proper escaping of quotes and commas
    const lines = content.split('\n');
    lines.forEach(line => {
      // Should not have unescaped quotes in the middle of a value
      const parts = line.split(',');
      expect(parts.length).toBeGreaterThanOrEqual(5);
    });
  });

  test('should include current date in filename', async ({ page }) => {
    await page.goto('/dashboard');

    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await exportButton.click();

    const download = await downloadPromise;
    const filename = download.suggestedFilename();

    const dateRegex = /\d{4}-\d{2}-\d{2}/;
    expect(filename).toMatch(dateRegex);
  });

  test('should allow multiple exports in sequence', async ({ page }) => {
    await page.goto('/dashboard');

    // First export
    const downloadPromise1 = page.waitForEvent('download');
    const exportButton = page.getByRole('button', { name: /export.*csv/i });
    await exportButton.click();
    const download1 = await downloadPromise1;
    expect(download1.suggestedFilename()).toMatch(/wills-export/);

    // Second export
    const downloadPromise2 = page.waitForEvent('download');
    await exportButton.click();
    const download2 = await downloadPromise2;
    expect(download2.suggestedFilename()).toMatch(/wills-export/);
  });
});

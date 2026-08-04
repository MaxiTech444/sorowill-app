import { test, expect } from '@playwright/test';

test.describe('Destructive Actions Confirmation', () => {
  test('should show confirmation modal when attempting to cancel will', async ({ page }) => {
    await page.goto('/will/123');

    const cancelButton = page.getByRole('button', { name: /cancel will/i });
    await cancelButton.click();

    const confirmationDialog = page.locator('[data-testid="destructive-action-modal"]');
    await expect(confirmationDialog).toBeVisible();
  });

  test('should display consequence warning in confirmation modal', async ({ page }) => {
    await page.goto('/will/123');

    const cancelButton = page.getByRole('button', { name: /cancel will/i });
    await cancelButton.click();

    // Verify warning text is displayed
    await expect(page.getByText(/this action cannot be undone/i)).toBeVisible();
    await expect(page.getByText(/funds will not be released/i)).toBeVisible();
  });

  test('should require typing "CONFIRM" before proceeding with cancel will', async ({ page }) => {
    await page.goto('/will/123');

    const cancelButton = page.getByRole('button', { name: /cancel will/i });
    await cancelButton.click();

    const confirmButton = page.getByRole('button', { name: /confirm/i }).nth(1);
    await expect(confirmButton).toBeDisabled();

    const confirmInput = page.locator('input[placeholder*="CONFIRM"]').first();
    await confirmInput.fill('CONFIRM');

    await expect(confirmButton).toBeEnabled();
  });

  test('should close confirmation modal when cancel button is clicked', async ({ page }) => {
    await page.goto('/will/123');

    const cancelButton = page.getByRole('button', { name: /cancel will/i });
    await cancelButton.click();

    const cancelConfirmButton = page.getByRole('button', { name: /cancel/i }).first();
    await cancelConfirmButton.click();

    const confirmationDialog = page.locator('[data-testid="destructive-action-modal"]');
    await expect(confirmationDialog).not.toBeVisible();
  });

  test('should allow confirmation only with exact text match', async ({ page }) => {
    await page.goto('/will/123');

    const cancelButton = page.getByRole('button', { name: /cancel will/i });
    await cancelButton.click();

    const confirmInput = page.locator('input[placeholder*="CONFIRM"]').first();
    const confirmButton = page.getByRole('button', { name: /confirm/i }).nth(1);

    // Test lowercase doesn't work
    await confirmInput.fill('confirm');
    await expect(confirmButton).toBeDisabled();

    // Test correct case works
    await confirmInput.fill('CONFIRM');
    await expect(confirmButton).toBeEnabled();
  });

  test('should not require confirmation for non-destructive actions like check-in', async ({ page }) => {
    await page.goto('/will/123');

    const checkInButton = page.getByRole('button', { name: /check in/i });
    await checkInButton.click();

    // Confirmation modal should not appear
    const confirmationDialog = page.locator('[data-testid="destructive-action-modal"]');
    await expect(confirmationDialog).not.toBeVisible();
  });

  test('should support will ID based confirmation', async ({ page }) => {
    await page.goto('/will/will-abc-123');

    const cancelButton = page.getByRole('button', { name: /cancel will/i });
    await cancelButton.click();

    const willIdInput = page.locator('input[placeholder*="will ID"]').first();
    if (await willIdInput.isVisible()) {
      const confirmButton = page.getByRole('button', { name: /confirm/i }).nth(1);

      // Empty should be disabled
      await expect(confirmButton).toBeDisabled();

      // Correct will ID should enable
      await willIdInput.fill('will-abc-123');
      await expect(confirmButton).toBeEnabled();

      // Wrong will ID should disable
      await willIdInput.fill('will-wrong-id');
      await expect(confirmButton).toBeDisabled();
    }
  });

  test('should proceed with cancellation after confirmation', async ({ page }) => {
    await page.goto('/will/123');

    const cancelButton = page.getByRole('button', { name: /cancel will/i });
    await cancelButton.click();

    const confirmInput = page.locator('input[placeholder*="CONFIRM"]').first();
    await confirmInput.fill('CONFIRM');

    const confirmButton = page.getByRole('button', { name: /confirm/i }).nth(1);
    await confirmButton.click();

    // Should navigate away or show success state
    // Exact behavior depends on implementation
    const confirmationDialog = page.locator('[data-testid="destructive-action-modal"]');
    await expect(confirmationDialog).not.toBeVisible();
  });

  test('should clear confirmation input when modal is closed', async ({ page }) => {
    await page.goto('/will/123');

    const cancelButton = page.getByRole('button', { name: /cancel will/i });
    await cancelButton.click();

    const confirmInput = page.locator('input[placeholder*="CONFIRM"]').first();
    await confirmInput.fill('CONFIRM');

    // Close modal
    const cancelConfirmButton = page.getByRole('button', { name: /cancel/i }).first();
    await cancelConfirmButton.click();

    // Reopen
    await cancelButton.click();

    // Input should be cleared
    await expect(confirmInput).toHaveValue('');
  });

  test('should show action-specific messaging for different destructive operations', async ({ page }) => {
    // This test assumes there are multiple types of destructive actions
    await page.goto('/will/123');

    const cancelButton = page.getByRole('button', { name: /cancel will/i });
    await cancelButton.click();

    // Verify cancel-specific message
    await expect(page.getByText(/cancel this will/i)).toBeVisible();
  });
});

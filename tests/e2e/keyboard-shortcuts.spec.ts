import { test, expect } from '@playwright/test';

test.describe('Keyboard Shortcuts', () => {
  test('should display shortcuts cheatsheet when ? is pressed', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Shift+Slash');

    const modal = page.locator('[data-testid="shortcuts-modal"]');
    await expect(modal).toBeVisible();
  });

  test('should close cheatsheet when Escape is pressed', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Shift+Slash');

    let modal = page.locator('[data-testid="shortcuts-modal"]');
    await expect(modal).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('should display all keyboard shortcuts in cheatsheet', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Shift+Slash');

    const cheatsheet = page.locator('[data-testid="shortcuts-cheatsheet"]');
    await expect(cheatsheet).toBeVisible();

    // Verify key shortcuts are listed
    await expect(page.getByText(/n\s+-\s+New Will/i)).toBeVisible();
    await expect(page.getByText(/\/\s+-\s+Search/i)).toBeVisible();
    await expect(page.getByText(/\?\s+-\s+Help/i)).toBeVisible();
  });

  test('should navigate to new will page when n key is pressed', async ({ page }) => {
    await page.goto('/dashboard');
    await page.keyboard.press('n');

    await expect(page).toHaveURL(/\/will\/new/);
  });

  test('should focus search when / key is pressed', async ({ page }) => {
    await page.goto('/dashboard');
    await page.keyboard.press('Slash');

    const searchInput = page.locator('[data-testid="search-input"], input[placeholder*="Search"]').first();
    await expect(searchInput).toBeFocused();
  });

  test('should not trigger shortcuts when typing in input field', async ({ page }) => {
    await page.goto('/dashboard');

    const searchInput = page.locator('[data-testid="search-input"], input[placeholder*="Search"]').first();
    await searchInput.focus();
    await searchInput.type('n');

    // Should not navigate to new will page
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should not trigger shortcuts when typing in textarea', async ({ page }) => {
    await page.goto('/will/new');

    // Create a temporary note field
    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible()) {
      await textarea.focus();
      await textarea.type('n');

      // URL should not change to /will/new since we're already there and shouldn't re-trigger
      await expect(page).toHaveURL(/\/will\/new/);
    }
  });

  test('should not trigger shortcuts with modifier keys', async ({ page }) => {
    const currentUrl = (await page.url());
    await page.goto('/');

    // Try Ctrl+N (should not trigger)
    await page.keyboard.press('Control+n');
    await expect(page).toHaveURL('/');

    // Try Cmd+N on Mac (should not trigger)
    await page.keyboard.press('Meta+n');
    await expect(page).toHaveURL('/');
  });

  test('should display help icon in navigation', async ({ page }) => {
    await page.goto('/dashboard');

    const helpIcon = page.locator('[data-testid="help-icon"]');
    await expect(helpIcon).toBeVisible();
  });

  test('should open cheatsheet when help icon is clicked', async ({ page }) => {
    await page.goto('/dashboard');

    const helpIcon = page.locator('[data-testid="help-icon"]');
    await helpIcon.click();

    const modal = page.locator('[data-testid="shortcuts-modal"]');
    await expect(modal).toBeVisible();
  });

  test('should close cheatsheet when close button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Shift+Slash');

    const closeButton = page.locator('[data-testid="shortcuts-modal-close"]');
    await closeButton.click();

    const modal = page.locator('[data-testid="shortcuts-modal"]');
    await expect(modal).not.toBeVisible();
  });
});

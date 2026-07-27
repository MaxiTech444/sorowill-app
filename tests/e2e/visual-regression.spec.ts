import { test, expect } from '@playwright/test';

test.describe('Visual regression', () => {
  test('landing page matches snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('landing-page.png', { fullPage: true });
  });

  test('dashboard page matches snapshot', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard-page.png', { fullPage: true });
  });

  test('will creation wizard step 1 matches snapshot', async ({ page }) => {
    await page.goto('/will/new');
    await expect(page).toHaveScreenshot('will-creation-step1.png', { fullPage: true });
  });

  test('will creation wizard step 2 matches snapshot', async ({ page }) => {
    await page.goto('/will/new');
    await page.getByPlaceholderText(/USDC Stellar Asset Contract/).fill('CASG');
    await page.getByPlaceholderText('1000.00').fill('100');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Step 2 of 5: Beneficiaries')).toBeVisible();
    await expect(page).toHaveScreenshot('will-creation-step2.png', { fullPage: true });
  });

  test('will creation wizard step 3 matches snapshot', async ({ page }) => {
    await page.goto('/will/new');
    await page.getByPlaceholderText(/USDC Stellar Asset Contract/).fill('CASG');
    await page.getByPlaceholderText('1000.00').fill('100');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Step 3 of 5: Timing')).toBeVisible();
    await expect(page).toHaveScreenshot('will-creation-step3.png', { fullPage: true });
  });
});

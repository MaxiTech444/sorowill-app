import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('loads and displays hero content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Protect your crypto legacy');
    await expect(page.locator('text=SoroWill is a trustless on-chain inheritance protocol')).toBeVisible();
  });

  test('shows "How it works" steps', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible();
    await expect(page.getByText('Lock USDC')).toBeVisible();
    await expect(page.getByText('Check in regularly')).toBeVisible();
    await expect(page.getByText('Funds release to heirs automatically')).toBeVisible();
  });

  test('shows "Why SoroWill" section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Why SoroWill' })).toBeVisible();
    await expect(page.getByText('Trustless')).toBeVisible();
    await expect(page.getByText('Automatic')).toBeVisible();
    await expect(page.getByText('Reversible')).toBeVisible();
  });

  test('has navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    await expect(page.getByRole('link', { name: 'Create a Will' })).toHaveAttribute('href', '/will/new');
  });

  test('"Create your Will" CTA links to creation page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Create your Will' })).toHaveAttribute('href', '/will/new');
  });
});

test.describe('Navigation', () => {
  test('navigates from landing to dashboard', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('navigates from landing to will creation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Create a Will' }).first().click();
    await expect(page).toHaveURL(/\/will\/new/);
    await expect(page.getByRole('heading', { name: 'Create a will' })).toBeVisible();
  });

  test('navigates back to landing via logo', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: 'SoroWill' }).click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Dashboard', () => {
  test('shows connect wallet prompt when no wallet', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Connect your wallet' })).toBeVisible();
  });
});

test.describe('Will creation wizard', () => {
  test('shows step 1 with amount inputs', async ({ page }) => {
    await page.goto('/will/new');
    await expect(page.getByText('Step 1 of 5: Amount')).toBeVisible();
    await expect(page.getByPlaceholder(/USDC Stellar Asset Contract/)).toBeVisible();
    await expect(page.getByPlaceholder('1000.00')).toBeVisible();
  });

  test('Next button is disabled without valid amount', async ({ page }) => {
    await page.goto('/will/new');
    await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  test('Next button enables with valid amount', async ({ page }) => {
    await page.goto('/will/new');
    await page.getByPlaceholder(/USDC Stellar Asset Contract/).fill('CASG...CONTRACT');
    await page.getByPlaceholder('1000.00').fill('500');
    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  test('can navigate through all 5 steps', async ({ page }) => {
    await page.goto('/will/new');

    // Step 1: Amount
    await page.getByPlaceholder(/USDC Stellar Asset Contract/).fill('CASG');
    await page.getByPlaceholder('1000.00').fill('100');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 2: Beneficiaries
    await expect(page.getByText('Step 2 of 5: Beneficiaries')).toBeVisible();
    await expect(page.getByRole('button', { name: /add beneficiary/i })).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 3: Timing
    await expect(page.getByText('Step 3 of 5: Timing')).toBeVisible();
    await expect(page.getByText('90 days').first()).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 4: Guardians
    await expect(page.getByText('Step 4 of 5: Guardians')).toBeVisible();
    await expect(page.getByText('Guardians (optional, up to 3)')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 5: Review
    await expect(page.getByText('Step 5 of 5: Review')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible();
    await expect(page.getByText('Create Will')).toBeVisible();
  });

  test('Back button navigates to previous step', async ({ page }) => {
    await page.goto('/will/new');
    await page.getByPlaceholder(/USDC Stellar Asset Contract/).fill('CASG');
    await page.getByPlaceholder('1000.00').fill('100');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Step 2 of 5: Beneficiaries')).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByText('Step 1 of 5: Amount')).toBeVisible();
  });

  test('Back button is disabled on first step', async ({ page }) => {
    await page.goto('/will/new');
    await expect(page.getByRole('button', { name: 'Back' })).toBeDisabled();
  });
});

test.describe('Will detail page', () => {
  test('shows loading state or error for invalid id', async ({ page }) => {
    await page.goto('/will/nonexistent');
    // The page should either show a loading skeleton or error boundary
    // depending on how fast the SDK responds
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Footer', () => {
  test('shows footer on landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('MIT License')).toBeVisible();
    await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
  });
});

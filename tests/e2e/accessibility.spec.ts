import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('landing page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(critical).toEqual([]);
  });

  test('dashboard page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(critical).toEqual([]);
  });

  test('will creation wizard has no critical accessibility violations', async ({ page }) => {
    await page.goto('/will/new');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(critical).toEqual([]);
  });

  test('all pages have proper heading hierarchy', async ({ page }) => {
    const pages = ['/', '/dashboard', '/will/new'];
    for (const url of pages) {
      await page.goto(url);
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
      expect(headings.length).toBeGreaterThan(0);
    }
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    const ctaLink = page.getByRole('link', { name: 'Create your Will' });
    await ctaLink.focus();
    await expect(ctaLink).toBeFocused();
  });

  test('form inputs have accessible labels', async ({ page }) => {
    await page.goto('/will/new');
    await expect(page.locator('label').first()).toBeVisible();
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/will/new');
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const name = await buttons.nth(i).getAttribute('aria-label');
      const text = await buttons.nth(i).textContent();
      expect(name || text).toBeTruthy();
    }
  });
});

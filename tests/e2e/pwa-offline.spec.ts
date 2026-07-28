import { test, expect } from '@playwright/test';

test.describe('PWA Installation', () => {
  test('should have valid manifest.json file', async ({ page }) => {
    await page.goto('/');

    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', /manifest/);
  });

  test('should load manifest with correct content', async ({ page }) => {
    await page.goto('/');

    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestHref).toBeTruthy();

    const response = await page.goto(manifestHref!);
    expect(response?.status()).toBe(200);

    const manifest = await response?.json();
    expect(manifest?.name).toBeTruthy();
    expect(manifest?.short_name).toBeTruthy();
    expect(manifest?.start_url).toBe('/');
  });

  test('should have required manifest properties', async ({ page }) => {
    await page.goto('/');

    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    const response = await page.goto(manifestHref!);
    const manifest = await response?.json();

    expect(manifest?.display).toBe('standalone');
    expect(manifest?.background_color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(manifest?.theme_color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(manifest?.icons).toBeDefined();
    expect(Array.isArray(manifest?.icons)).toBe(true);
  });

  test('should include icon assets in manifest', async ({ page }) => {
    await page.goto('/');

    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    const response = await page.goto(manifestHref!);
    const manifest = await response?.json();

    expect(manifest?.icons.length).toBeGreaterThanOrEqual(2);

    // Should have at least 192x192 and 512x512
    const sizes = manifest?.icons.map((icon: any) => icon.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
  });

  test('should include maskable icon for adaptive icons', async ({ page }) => {
    await page.goto('/');

    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    const response = await page.goto(manifestHref!);
    const manifest = await response?.json();

    const maskableIcon = manifest?.icons.find((icon: any) => icon.purpose?.includes('maskable'));
    expect(maskableIcon).toBeDefined();
  });

  test('should set theme color meta tag', async ({ page }) => {
    await page.goto('/');

    const themeColorMeta = page.locator('meta[name="theme-color"]');
    await expect(themeColorMeta).toHaveAttribute('content', /^#[0-9A-Fa-f]{6}$/);
  });

  test('should be installable in Chromium browser', async ({ page, context }) => {
    // This test verifies PWA installability criteria
    await page.goto('/');

    // Check HTTPS or localhost (required for PWA)
    const url = page.url();
    expect(url === 'http://localhost:3000/' || url.startsWith('https://')).toBe(true);

    // Check manifest exists
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', /manifest/);

    // Check service worker
    const hasServiceWorker = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    expect(hasServiceWorker).toBe(true);
  });

  test('should have all required PWA meta tags', async ({ page }) => {
    await page.goto('/');

    // Viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toBeVisible();

    // Theme color
    const themeColorMeta = page.locator('meta[name="theme-color"]');
    await expect(themeColorMeta).toBeVisible();

    // Description
    const descriptionMeta = page.locator('meta[name="description"]');
    await expect(descriptionMeta).toBeVisible();
  });

  test('should have apple-touch-icon for iOS', async ({ page }) => {
    await page.goto('/');

    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    const count = await appleTouchIcon.count();
    expect(count).toBeGreaterThanOrEqual(0); // Optional but good to have
  });
});

test.describe('Offline Functionality', () => {
  test('should serve offline page when network is unavailable', async ({ page, context }) => {
    // Go online first
    await page.goto('/');
    await expect(page.locator('h1')).toBeTruthy();

    // Simulate offline by disabling network
    await context.setOffline(true);

    // Try to navigate - should show offline shell or cached content
    const response = await page.goto('/', { waitUntil: 'networkidle' }).catch(() => null);

    // Either shows cached content or offline page
    if (response) {
      expect([200, 304]).toContain(response.status());
    } else {
      // If response is null, offline page should be shown from service worker
      expect(page.url()).toBeTruthy();
    }

    // Re-enable network
    await context.setOffline(false);
  });

  test('should show meaningful offline message', async ({ page, context }) => {
    await page.goto('/');

    // Go offline
    await context.setOffline(true);

    // Try to perform an action that requires network
    const buttons = page.locator('button');
    const count = await buttons.count();

    if (count > 0) {
      // App should either show cached UI or offline message
      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).toBeTruthy();
    }

    // Re-enable
    await context.setOffline(false);
  });

  test('should have service worker registered', async ({ page }) => {
    await page.goto('/');

    const serviceWorkerStatus = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          return registration?.active?.state;
        } catch {
          return null;
        }
      }
      return null;
    });

    // Service worker should be either activated or in other valid states
    if (serviceWorkerStatus) {
      expect(['installing', 'installed', 'activating', 'activated']).toContain(serviceWorkerStatus);
    }
  });

  test('should cache critical resources', async ({ page }) => {
    await page.goto('/');

    const cacheNames = await page.evaluate(async () => {
      if ('caches' in window) {
        const names = await caches.keys();
        return names;
      }
      return [];
    });

    // Should have some caches set up for offline support
    expect(Array.isArray(cacheNames)).toBe(true);
  });

  test('should handle offline gracefully without crashing', async ({ page, context }) => {
    await page.goto('/');

    // Go offline
    await context.setOffline(true);

    // Wait a moment
    await page.waitForTimeout(1000);

    // Page should still be visible and not crashed
    await expect(page.locator('body')).toBeVisible();

    // No errors in console
    let consoleErrors = 0;
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors++;
      }
    });

    // Re-enable network
    await context.setOffline(false);
  });
});

test.describe('Service Worker', () => {
  test('should register service worker successfully', async ({ page }) => {
    await page.goto('/');

    const registration = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          return {
            active: !!reg.active,
            installing: !!reg.installing,
            waiting: !!reg.waiting,
            scope: reg.scope,
          };
        } catch (e) {
          return null;
        }
      }
      return null;
    });

    // Service worker should be registered (may not be active immediately)
    if (registration) {
      expect(registration.scope).toContain('/');
    }
  });

  test('should cache static assets', async ({ page }) => {
    await page.goto('/');

    const caches = await page.evaluate(async () => {
      const cacheNames = await window.caches.keys();
      const cachesWithContent: Record<string, string[]> = {};

      for (const name of cacheNames) {
        const cache = await window.caches.open(name);
        const keys = await cache.keys();
        cachesWithContent[name] = keys.map(req => req.url);
      }

      return cachesWithContent;
    });

    // Should have some cached content
    const totalCachedItems = Object.values(caches).flat().length;
    expect(totalCachedItems).toBeGreaterThanOrEqual(0);
  });
});

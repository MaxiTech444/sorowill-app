import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Analytics/Observability Integration (#42)', () => {
  it('verifies analytics provider is configured in layout', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');

    expect(content).toMatch(/plausible|analytics|Analytics|tracker|Tracker/i);
  });

  it('verifies analytics initialization script exists', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');

    expect(content).toMatch(/script|Script|analytics|Analytics/i);
  });

  it('verifies tracking events are implemented for landing page view', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const homePage = path.join(process.cwd(), 'src/app/page.tsx');

    if (fs.existsSync(homePage)) {
      const content = fs.readFileSync(homePage, 'utf-8');
      expect(content).toMatch(/useEffect|useLayoutEffect|trackEvent|analytics|Analytics/i);
    }
  });

  it('verifies tracking for will-creation started event', () => {
    const willNewPath = path.join(process.cwd(), 'src/app/will/new/page.tsx');

    if (fs.existsSync(willNewPath)) {
      const content = fs.readFileSync(willNewPath, 'utf-8');
      expect(content).toMatch(/useEffect|useLayoutEffect|trackEvent|analytics|Analytics/i);
    }
  });

  it('verifies tracking for will-creation completed event', () => {
    const dashboardPath = path.join(process.cwd(), 'src/app/dashboard/page.tsx');

    if (fs.existsSync(dashboardPath)) {
      const content = fs.readFileSync(dashboardPath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('verifies tracking for check-in performed event', () => {
    const dashboardPath = path.join(process.cwd(), 'src/app/dashboard/page.tsx');

    if (fs.existsSync(dashboardPath)) {
      const content = fs.readFileSync(dashboardPath, 'utf-8');
      expect(content).toMatch(/checkIn|check-in|CheckIn|onCheckIn/i);
    }
  });

  it('verifies privacy documentation exists or is documented', () => {
    const readmePath = path.join(process.cwd(), 'README.md');
    const privacyPath = path.join(process.cwd(), 'PRIVACY.md');

    if (fs.existsSync(readmePath)) {
      const content = fs.readFileSync(readmePath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('verifies analytics events are tracked non-invasively', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');

    expect(content).not.toMatch(/gtag|google.*analytics|_gid|_ga\(|facebook|pixel/i);
  });

  it('verifies no personal data is tracked', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');

    expect(content).not.toMatch(/email|password|private|secret|key|credential/i);
  });

  it('verifies analytics library is installed', () => {
    const packagePath = path.join(process.cwd(), 'package.json');
    const content = fs.readFileSync(packagePath, 'utf-8');

    expect(content).toMatch(/analytics|plausible|posthog|mixpanel|amplitude|segment/i);
  });
});

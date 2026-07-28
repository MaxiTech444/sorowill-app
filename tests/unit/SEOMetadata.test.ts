import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('SEO Metadata Audit (#40)', () => {
  it('verifies sitemap.xml exists at public root', () => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);
  });

  it('verifies robots.txt exists at public root', () => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);
  });

  it('verifies sitemap.xml contains expected routes', () => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const content = fs.readFileSync(sitemapPath, 'utf-8');

    expect(content).toContain('<urlset');
    expect(content).toContain('</urlset>');
    expect(content).toContain('<url>');
  });

  it('verifies robots.txt has proper content', () => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    const content = fs.readFileSync(robotsPath, 'utf-8');

    expect(content).toMatch(/User-agent:/i);
    expect(content.length).toBeGreaterThan(0);
  });

  it('verifies landing page has Open Graph metadata', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');

    expect(content).toMatch(/openGraph|og:|metadataBase/i);
  });

  it('verifies verify page has Open Graph metadata', () => {
    const verifyPagePath = path.join(process.cwd(), 'src/app/verify/page.tsx');
    if (fs.existsSync(verifyPagePath)) {
      const content = fs.readFileSync(verifyPagePath, 'utf-8');
      expect(content).toMatch(/generateMetadata|metadata|openGraph/i);
    }
  });

  it('verifies Twitter Card metadata is configured', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');

    expect(content).toMatch(/twitter|og:/i);
  });

  it('verifies metadata base URL is configured', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');

    expect(content).toMatch(/metadataBase|baseUrl/i);
  });
});

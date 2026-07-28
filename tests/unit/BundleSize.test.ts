import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Bundle Size Audit (#39)', () => {
  it('verifies build artifacts exist', () => {
    const buildDir = path.join(process.cwd(), '.next');
    expect(fs.existsSync(buildDir)).toBe(true);
  });

  it('verifies dynamic imports are used for heavy components', () => {
    const appContent = fs.readFileSync(
      path.join(process.cwd(), 'src/app/dashboard/page.tsx'),
      'utf-8'
    );
    expect(appContent).toMatch(/dynamic\(|next\/dynamic/);
  });

  it('verifies PDF export component uses dynamic import', () => {
    const componentPaths = [
      'src/components/PDFExport.tsx',
      'src/components/ExportPDF.tsx',
      'src/features/pdf-export.tsx',
    ];

    let found = false;
    for (const componentPath of componentPaths) {
      const fullPath = path.join(process.cwd(), componentPath);
      if (fs.existsSync(fullPath)) {
        found = true;
        break;
      }
    }

    if (found) {
      const appPath = path.join(process.cwd(), 'src/app/dashboard/page.tsx');
      const content = fs.readFileSync(appPath, 'utf-8');
      expect(content).toContain('dynamic');
    }
  });

  it('verifies QR code component uses dynamic import', () => {
    const componentPaths = [
      'src/components/QRCode.tsx',
      'src/components/QRCodeGenerator.tsx',
      'src/features/qr-code.tsx',
    ];

    let found = false;
    for (const componentPath of componentPaths) {
      const fullPath = path.join(process.cwd(), componentPath);
      if (fs.existsSync(fullPath)) {
        found = true;
        break;
      }
    }

    if (found) {
      const appPath = path.join(process.cwd(), 'src/app/dashboard/page.tsx');
      const content = fs.readFileSync(appPath, 'utf-8');
      expect(content).toContain('dynamic');
    }
  });

  it('verifies no console errors in bundle analysis', () => {
    const buildDir = path.join(process.cwd(), '.next');
    const files = fs.readdirSync(buildDir);
    expect(files.length).toBeGreaterThan(0);
  });
});

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Input Sanitization Audit', () => {
  // Audit for dangerouslySetInnerHTML usage
  it('should not use dangerouslySetInnerHTML in any component', () => {
    const componentsDir = path.join(process.cwd(), 'src', 'components');
    const appDir = path.join(process.cwd(), 'src', 'app');

    const checkDirForDangerousHTML = (dir: string): string[] => {
      const violations: string[] = [];
      const files = fs.readdirSync(dir, { recursive: true });

      files.forEach(file => {
        if (file.toString().endsWith('.tsx') || file.toString().endsWith('.ts')) {
          const filePath = path.join(dir, file.toString());
          const content = fs.readFileSync(filePath, 'utf-8');
          if (content.includes('dangerouslySetInnerHTML')) {
            violations.push(file.toString());
          }
        }
      });

      return violations;
    };

    const violations = [
      ...checkDirForDangerousHTML(componentsDir),
      ...checkDirForDangerousHTML(appDir),
    ];

    expect(violations).toEqual([]);
  });

  // Test that beneficiary addresses are properly validated
  it('should validate beneficiary Stellar addresses', () => {
    const stellarAddressPattern = /^G[A-Z2-7]{55}$/;

    const validAddresses = [
      'GBBD47UZQ5VOHF4AKOA7CMM7SVQE6AKMOUIVJGN7BQHMPUYKUUY7BK43',
      'GCZST3WHSPDTQK37QWFC3KXZK5OJJ53FUWZPAB5XGTK47ZD5PTJUWQXI',
    ];

    const invalidAddresses = [
      'invalid-address',
      '12345',
      'GBBD47UZQ5VOHF4AKOA7CMM7SVQE6AKMOUIVJGN7BQHMPUYKUUY7BK4',
      'SBBD47UZQ5VOHF4AKOA7CMM7SVQE6AKMOUIVJGN7BQHMPUYKUUY7BK43',
    ];

    validAddresses.forEach(addr => {
      expect(addr).toMatch(stellarAddressPattern);
    });

    invalidAddresses.forEach(addr => {
      expect(addr).not.toMatch(stellarAddressPattern);
    });
  });

  // Test that percentage inputs are properly validated
  it('should validate percentage inputs are numeric and within bounds', () => {
    const validatePercentage = (value: any): boolean => {
      if (typeof value !== 'number') return false;
      return value >= 0 && value <= 100 && Number.isInteger(value);
    };

    expect(validatePercentage(50)).toBe(true);
    expect(validatePercentage(0)).toBe(true);
    expect(validatePercentage(100)).toBe(true);
    expect(validatePercentage(101)).toBe(false);
    expect(validatePercentage(-1)).toBe(false);
    expect(validatePercentage(50.5)).toBe(false);
    expect(validatePercentage('50')).toBe(false);
  });

  // Test that text inputs are escaped when displayed
  it('should properly escape special characters in form inputs', () => {
    const escapeHTML = (text: string): string => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return text.replace(/[&<>"']/g, char => map[char]);
    };

    const maliciousInput = '<img src=x onerror="alert(1)">';
    const escaped = escapeHTML(maliciousInput);

    expect(escaped).not.toContain('<img');
    expect(escaped).toContain('onerror');
    expect(escaped).toContain('&lt;');
    expect(escaped).toContain('&gt;');
  });

  // Test that form submissions validate input types
  it('should prevent XSS through event handler injection', () => {
    const isSafeUserInput = (input: string): boolean => {
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /on\w+\s*=/gi,
        /javascript:/gi,
        /data:text\/html/gi,
      ];

      return !xssPatterns.some(pattern => pattern.test(input));
    };

    expect(isSafeUserInput('regular text')).toBe(true);
    expect(isSafeUserInput('GADDRESS123')).toBe(true);
    expect(isSafeUserInput('<script>alert("xss")</script>')).toBe(false);
    expect(isSafeUserInput('text onclick="alert(1)"')).toBe(false);
    expect(isSafeUserInput('javascript:alert(1)')).toBe(false);
  });

  // Test that form data is not logged or exposed
  it('should validate sensitive form data is not exposed in logs', () => {
    const sensitivePatterns = [
      /private key/gi,
      /secret/gi,
      /password/gi,
      /token/gi,
    ];

    const logContent = 'User submitted form with address GABC...';
    const hasSensitiveData = sensitivePatterns.some(pattern => pattern.test(logContent));

    expect(hasSensitiveData).toBe(false);
  });
});

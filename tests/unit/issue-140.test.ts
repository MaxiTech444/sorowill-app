import { describe, it, expect } from 'vitest';
import { isValidAmount } from '@/lib/amount';

/**
 * Test suite to verify the fix for issue #140:
 * Scientific notation amounts should be rejected at step 0 (Amount step)
 * and not crash the Review step
 */
describe('Issue #140: Scientific notation amounts crash Review step', () => {
  describe('Scientific notation rejection', () => {
    it('should reject 1e5 (scientific notation)', () => {
      expect(isValidAmount('1e5')).toBe(false);
    });

    it('should reject 1E5 (uppercase E)', () => {
      expect(isValidAmount('1E5')).toBe(false);
    });

    it('should reject 1.5e2 (decimal with exponent)', () => {
      expect(isValidAmount('1.5e2')).toBe(false);
    });

    it('should reject 1.5E-2 (negative exponent)', () => {
      expect(isValidAmount('1.5E-2')).toBe(false);
    });

    it('should reject 100e10', () => {
      expect(isValidAmount('100e10')).toBe(false);
    });
  });

  describe('Valid amount acceptance', () => {
    it('should accept simple integer amounts', () => {
      expect(isValidAmount('100')).toBe(true);
    });

    it('should accept decimal amounts', () => {
      expect(isValidAmount('100.50')).toBe(true);
      expect(isValidAmount('0.01')).toBe(true);
    });

    it('should accept large amounts', () => {
      expect(isValidAmount('1000000')).toBe(true);
      expect(isValidAmount('999999.99')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should reject zero', () => {
      expect(isValidAmount('0')).toBe(false);
    });

    it('should reject negative numbers', () => {
      expect(isValidAmount('-100')).toBe(false);
    });

    it('should reject empty strings', () => {
      expect(isValidAmount('')).toBe(false);
    });

    it('should reject non-numeric strings', () => {
      expect(isValidAmount('abc')).toBe(false);
      expect(isValidAmount('100abc')).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(isValidAmount('  100  ')).toBe(true);
      expect(isValidAmount('  0.01  ')).toBe(true);
    });
  });

  describe('Step 0 validation behavior', () => {
    it('should prevent advancing past Amount step with 1e5', () => {
      // In the actual form, amountValid = tokenValid && isValidAmount(amount)
      // So if isValidAmount('1e5') is false, the user cannot click Next
      const amount = '1e5';
      const tokenValid = true; // assuming token is valid
      const amountValid = tokenValid && isValidAmount(amount);
      expect(amountValid).toBe(false);
    });

    it('should allow advancing past Amount step with valid amounts', () => {
      const amount = '100.50';
      const tokenValid = true;
      const amountValid = tokenValid && isValidAmount(amount);
      expect(amountValid).toBe(true);
    });
  });
});

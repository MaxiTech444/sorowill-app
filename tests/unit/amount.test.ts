import { describe, it, expect } from 'vitest';
import { isValidAmount } from '@/lib/amount';

describe('isValidAmount', () => {
  it('should accept valid decimal amounts', () => {
    expect(isValidAmount('100')).toBe(true);
    expect(isValidAmount('100.50')).toBe(true);
    expect(isValidAmount('0.01')).toBe(true);
    expect(isValidAmount('1000000.99')).toBe(true);
  });

  it('should reject scientific notation', () => {
    expect(isValidAmount('1e5')).toBe(false);
    expect(isValidAmount('1E5')).toBe(false);
    expect(isValidAmount('1.5e2')).toBe(false);
    expect(isValidAmount('1.5E2')).toBe(false);
  });

  it('should reject empty and whitespace strings', () => {
    expect(isValidAmount('')).toBe(false);
    expect(isValidAmount('   ')).toBe(false);
  });

  it('should reject non-positive numbers', () => {
    expect(isValidAmount('0')).toBe(false);
    expect(isValidAmount('-100')).toBe(false);
  });

  it('should reject non-numeric strings', () => {
    expect(isValidAmount('abc')).toBe(false);
    expect(isValidAmount('100abc')).toBe(false);
  });

  it('should handle leading/trailing whitespace', () => {
    expect(isValidAmount('  100  ')).toBe(true);
    expect(isValidAmount('  100.50  ')).toBe(true);
  });
});

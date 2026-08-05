import { toStroops } from '@sorowill/sdk';

/**
 * Validates that an amount string can be successfully parsed by toStroops().
 * This rejects scientific notation (e.g., '1e5') and other invalid formats
 * that would cause toStroops() to throw.
 *
 * @param amount - The amount string to validate
 * @returns true if the amount is valid and can be safely passed to toStroops()
 */
export function isValidAmount(amount: string): boolean {
  const trimmed = amount.trim();

  // Empty strings are handled at a higher level
  if (trimmed === '') {
    return false;
  }

  // Check if the value can be converted to a positive number
  const num = Number(trimmed);
  if (isNaN(num) || num <= 0) {
    return false;
  }

  // Reject scientific notation (contains 'e' or 'E')
  if (/[eE]/.test(trimmed)) {
    return false;
  }

  // Try to call toStroops to ensure it doesn't throw
  try {
    toStroops(trimmed);
    return true;
  } catch {
    return false;
  }
}

/**
 * Lightweight top-up amount validator used inline in the will detail UI.
 * Matches the historical behavior of the previously exported helper.
 */
export function isTopUpAmountValid(amount: string): boolean {
  const trimmed = amount.trim();
  return trimmed !== '' && Number.isFinite(Number(trimmed)) && Number(trimmed) > 0;
}

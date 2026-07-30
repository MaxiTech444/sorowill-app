import { describe, it, expect } from 'vitest';
import { validateGuardians, isValidStellarAddress } from '@/lib/guardianValidation';

describe('Guardian Validation - Duplicate Detection', () => {
  const validAddr1 = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  const validAddr2 = 'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';
  const validAddr3 = 'GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC';

  it('detects duplicate guardian addresses in the same will', () => {
    const guardians = [validAddr1, validAddr1, validAddr2];
    const { rowErrors, topError } = validateGuardians(guardians, null);

    expect(rowErrors[0]).toBe('');
    expect(rowErrors[1]).toBe('Duplicate guardian address');
    expect(rowErrors[2]).toBe('');
    expect(topError).toBe('Please fix the guardian address errors above before continuing.');
  });

  it('allows unique guardian addresses without errors', () => {
    const guardians = [validAddr1, validAddr2, validAddr3];
    const { rowErrors, topError } = validateGuardians(guardians, null);

    expect(rowErrors[0]).toBe('');
    expect(rowErrors[1]).toBe('');
    expect(rowErrors[2]).toBe('');
    expect(topError).toBeNull();
  });

  it('ignores whitespace when detecting duplicates', () => {
    const guardians = [validAddr1, ` ${validAddr1} `, validAddr2];
    const { rowErrors, topError } = validateGuardians(guardians, null);

    expect(rowErrors[0]).toBe('');
    expect(rowErrors[1]).toBe('Duplicate guardian address');
    expect(topError).not.toBeNull();
  });

  it('handles empty rows correctly when checking for duplicates', () => {
    const guardians = [validAddr1, '', validAddr1];
    const { rowErrors, topError } = validateGuardians(guardians, null);

    expect(rowErrors[1]).toBe('');
    expect(rowErrors[2]).toBe('Duplicate guardian address');
    expect(topError).not.toBeNull();
  });

  it('detects multiple duplicates in one list', () => {
    const guardians = [validAddr1, validAddr1, validAddr2, validAddr2];
    const { rowErrors, topError } = validateGuardians(guardians, null);

    expect(rowErrors[0]).toBe('');
    expect(rowErrors[1]).toBe('Duplicate guardian address');
    expect(rowErrors[2]).toBe('');
    expect(rowErrors[3]).toBe('Duplicate guardian address');
    expect(topError).not.toBeNull();
  });

  it('sets top-level error message when duplicates are found', () => {
    const guardians = [validAddr1, validAddr1];
    const { topError } = validateGuardians(guardians, null);

    expect(topError).toBe('Please fix the guardian address errors above before continuing.');
  });

  it('returns no error when guardians list is empty or has only one guardian', () => {
    const { topError: topError1 } = validateGuardians([], null);
    expect(topError1).toBeNull();

    const { topError: topError2 } = validateGuardians([validAddr1], null);
    expect(topError2).toBeNull();
  });

  it('flags invalid addresses before checking for duplicates', () => {
    const invalidAddr = 'INVALID_ADDRESS_1234567890';
    const guardians = [invalidAddr, invalidAddr];
    const { rowErrors, topError } = validateGuardians(guardians, null);

    expect(rowErrors[0]).toBe('Not a valid Stellar address (must start with G and be 56 characters)');
    expect(rowErrors[1]).toBe('Not a valid Stellar address (must start with G and be 56 characters)');
    expect(topError).not.toBeNull();
  });

  it('detects duplicate that is also the owner address', () => {
    const ownerAddress = validAddr1;
    const guardians = [validAddr1, validAddr2];
    const { rowErrors, topError } = validateGuardians(guardians, ownerAddress);

    expect(rowErrors[0]).toBe('A guardian cannot be the same as the will owner');
    expect(rowErrors[1]).toBe('');
    expect(topError).not.toBeNull();
  });

  it('detects all three slots filled with same address', () => {
    const guardians = [validAddr1, validAddr1, validAddr1];
    const { rowErrors, topError } = validateGuardians(guardians, null);

    expect(rowErrors[0]).toBe('');
    expect(rowErrors[1]).toBe('Duplicate guardian address');
    expect(rowErrors[2]).toBe('Duplicate guardian address');
    expect(topError).not.toBeNull();
  });

  it('only returns top-level error when there are actual errors', () => {
    const guardians = [validAddr1, ''];
    const { topError } = validateGuardians(guardians, null);

    expect(topError).toBeNull();
  });

  it('isValidStellarAddress rejects malformed addresses', () => {
    expect(isValidStellarAddress('')).toBe(false);
    expect(isValidStellarAddress('G')).toBe(false);
    expect(isValidStellarAddress('g'.repeat(56))).toBe(false);
    expect(isValidStellarAddress('GABCDEFG')).toBe(false);
    expect(isValidStellarAddress(validAddr1)).toBe(true);
  });
});

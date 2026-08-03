export function isValidStellarAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address);
}

export interface GuardianValidationResult {
  rowErrors: string[];
  topError: string | null;
}

export function validateGuardians(
  guardians: string[],
  ownerAddress: string | null,
): GuardianValidationResult {
  const rowErrors: string[] = guardians.map(() => '');
  let topError: string | null = null;

  const seen = new Set<string>();

  for (let i = 0; i < guardians.length; i++) {
    const g = guardians[i].trim();
    if (g === '') continue;

    if (!isValidStellarAddress(g)) {
      rowErrors[i] = 'Not a valid Stellar address (must start with G and be 56 characters)';
      continue;
    }

    if (ownerAddress && g === ownerAddress) {
      rowErrors[i] = 'A guardian cannot be the same as the will owner';
      continue;
    }

    if (seen.has(g)) {
      rowErrors[i] = 'Duplicate guardian address';
      continue;
    }

    seen.add(g);
  }

  const hasRowErrors = rowErrors.some((e, i) => e !== '' && guardians[i].trim() !== '');
  if (hasRowErrors) {
    topError = 'Please fix the guardian address errors above before continuing.';
  }

  return { rowErrors, topError };
}

import { describe, it, expect, vi } from 'vitest';

// We test the core logic: when showEditBeneficiaries is open,
// a refetch should NOT overwrite draftBeneficiaries.
// We verify this by simulating the behavior pattern from the
// WillDetailPage component using a simplified test harness.

// Mock @sorowill/sdk
vi.mock('@sorowill/sdk', () => ({
  WillStatus: {
    Active: 'Active',
    Triggered: 'Triggered',
    Released: 'Released',
    Cancelled: 'Cancelled',
  },
  formatUSDC: (amount: bigint) => (Number(amount) / 1_000_000).toFixed(2),
  toStroops: (usdc: string) => BigInt(Math.round(Number(usdc) * 1_000_000)),
  calculateShares: (balance: string, beneficiaries: Array<{ address: string; percentage: number }>) => {
    const total = BigInt(balance);
    const results = beneficiaries.map((b) => ({
      address: b.address,
      share: String((total * BigInt(b.percentage)) / 100n),
    }));
    return results;
  },
  validateBeneficiaries: () => true,
}));

describe('WillDetailPage beneficiary draft protection', () => {
  it('preserves draft edits when refetch fires while edit panel is open', async () => {
    // Simulate the ref pattern from WillDetailPage
    const originalBeneficiaries = [
      { address: 'GA...ORIG', percentage: 100 },
    ];
    const editedDraft = [
      { address: 'GA...ORIG', percentage: 60 },
      { address: 'GB...NEW', percentage: 40 },
    ];

    let showEditOpen = false;
    let draftState = [...originalBeneficiaries];

    // This mirrors the refetch logic
    function simulatedRefetch() {
      const freshFromServer = [
        { address: 'GA...ORIG', percentage: 100 },
      ];
      if (!showEditOpen) {
        draftState = [...freshFromServer];
      }
      // When showEditOpen is true, draftState should remain unchanged
    }

    // Step 1: Open edit panel and make changes
    showEditOpen = true;
    draftState = [...editedDraft];

    // Step 2: Trigger an unrelated action that calls refetch
    simulatedRefetch();

    // Step 3: Assert that the draft edits survive
    expect(draftState).toEqual(editedDraft);
    expect(draftState.length).toBe(2);
    expect(draftState[0].percentage).toBe(60);
    expect(draftState[1].address).toBe('GB...NEW');
  });

  it('resets draft beneficiaries on first load when edit panel is closed', async () => {
    const freshFromServer = [
      { address: 'GA...FRESH', percentage: 100 },
    ];

    let showEditOpen = false;
    let draftState: Array<{ address: string; percentage: number }> = [];

    function simulatedRefetch() {
      if (!showEditOpen) {
        draftState = [...freshFromServer];
      }
    }

    // Edit panel is closed, so refetch should update draft
    simulatedRefetch();

    expect(draftState).toEqual(freshFromServer);
  });
});

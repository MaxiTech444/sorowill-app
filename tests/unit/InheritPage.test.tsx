import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

vi.mock('@sorowill/sdk', async () => {
  const actual = await vi.importActual('@sorowill/sdk');
  return {
    ...actual,
    calculateShares: (balance: string, beneficiaries: Array<{ address: string; percentage: number }>) => {
      const total = BigInt(balance);
      return beneficiaries.map((b) => ({
        address: b.address,
        share: String((total * BigInt(b.percentage)) / 100n),
      }));
    },
    formatUSDC: (amount: bigint | string) => (Number(amount) / 1_000_000).toFixed(2),
    WillStatus: { Active: 'Active', Triggered: 'Triggered', Released: 'Released', Cancelled: 'Cancelled' },
  };
});

vi.mock('@/lib/freighter', () => ({
  safeGetPublicKey: vi.fn().mockResolvedValue('GDUPLICATE1234567890ABCDEF'),
  truncateAddress: (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4),
}));

vi.mock('@/lib/sorowill', () => ({
  getSoroWillClient: () => ({
    getWill: vi.fn().mockResolvedValue({
      id: '1',
      owner: 'GOWNER1234567890ABCDEF',
      status: 'Triggered',
      balance: '1000000000',
      beneficiaries: [
        { address: 'GDUPLICATE1234567890ABCDEF', percentage: 30 },
        { address: 'GDUPLICATE1234567890ABCDEF', percentage: 20 },
        { address: 'GOTHER1234567890ABCDEF', percentage: 50 },
      ],
      guardians: [],
      guardianVotes: 0,
      triggerTime: new Date(Date.now() - 86_400_000 * 30),
      gracePeriodDays: 7,
      checkinPeriodDays: 90,
      lastCheckin: new Date(Date.now() - 86_400_000 * 35),
    }),
  }),
  stellarExpertUrl: (kind: string, id: string) => `https://stellar.expert/explorer/testnet/${kind}/${id}`,
}));

vi.mock('@/components/Toast', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));

vi.mock('@/components/StatusBanner', () => ({
  StatusBanner: ({ status }: { status: string }) => <span data-testid="status">{status}</span>,
}));

vi.mock('@/components/GuardianPanel', () => ({
  GuardianPanel: () => null,
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const InheritPage = require('@/app/inherit/[id]/page').default;

describe('InheritPage duplicate beneficiary share summing', () => {
  it('sums all matching beneficiary entries for the connected address', async () => {
    render(<InheritPage />);

    const status = await screen.findByTestId('status');
    expect(status).toHaveTextContent('Triggered');

    const shareTexts = screen.getByText(/500\.00 USDC/);
    expect(shareTexts).toBeInTheDocument();
  });

  it('displays the summed share amount for duplicate beneficiary entries, not just the first', async () => {
    render(<InheritPage />);

    const shareTexts = screen.getByText(/500\.00 USDC/);
    expect(shareTexts).toBeInTheDocument();
  });
});
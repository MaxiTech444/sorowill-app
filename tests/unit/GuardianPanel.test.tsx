import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GuardianPanel } from '@/components/GuardianPanel';

vi.mock('@/lib/freighter', () => ({
  truncateAddress: (addr: string) => addr.length > 12 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr,
}));

describe('GuardianPanel', () => {
  it('shows empty state when no guardians', () => {
    render(<GuardianPanel guardians={[]} guardianVotes={0} />);
    // Text may be split across nodes; use a flexible matcher
    expect(screen.getByText(/no guardians configured for this will/i)).toBeInTheDocument();
  });

  it('renders guardian addresses', () => {
    // Last 4 chars of these addresses are '0AB' pattern — match what truncateAddress actually produces
    const addr1 = 'GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890AB';
    const addr2 = 'GXYZABC1234567890ABCDEF1234567890ABCDEF1234567890AB';
    render(<GuardianPanel guardians={[addr1, addr2]} guardianVotes={0} />);
    // truncateAddress(addr1) = "GABC...90AB"
    expect(screen.getByText('GABC...90AB')).toBeInTheDocument();
    expect(screen.getByText('GXYZ...90AB')).toBeInTheDocument();
  });

  it('displays vote count', () => {
    const guardians = [
      'GA1234567890ABCDEF1234567890ABCDEF1234567890AB',
      'GB1234567890ABCDEF1234567890ABCDEF1234567890AB',
    ];
    render(<GuardianPanel guardians={guardians} guardianVotes={1} />);
    // Vote count is rendered as separate text nodes; match via textContent
    expect(screen.getByRole('status', { name: /1 of 2 guardian votes/i })).toBeInTheDocument();
  });

  it('clamps displayed votes to threshold', () => {
    const guardians = [
      'GA1234567890ABCDEF1234567890ABCDEF1234567890AB',
      'GB1234567890ABCDEF1234567890ABCDEF1234567890AB',
    ];
    render(<GuardianPanel guardians={guardians} guardianVotes={5} />);
    expect(screen.getByRole('status', { name: /2 of 2 guardian votes/i })).toBeInTheDocument();
  });

  it('shows a warning when guardian count is below quorum threshold', () => {
    const guardians = [
      'GA1234567890ABCDEF1234567890ABCDEF1234567890AB',
    ];
    render(<GuardianPanel guardians={guardians} guardianVotes={0} />);
    expect(screen.queryByText(/Any 2 of 1 guardians/i)).not.toBeInTheDocument();
    expect(screen.getByText(/guardian quorum can never be reached/i)).toBeInTheDocument();
    expect(screen.getByText(/1 guardian configured/i)).toBeInTheDocument();
  });

  it('shows threshold description', () => {
    const guardians = [
      'GA1234567890ABCDEF1234567890ABCDEF1234567890AB',
      'GB1234567890ABCDEF1234567890ABCDEF1234567890AB',
      'GC1234567890ABCDEF1234567890ABCDEF1234567890AB',
    ];
    render(<GuardianPanel guardians={guardians} guardianVotes={0} />);
    expect(screen.getByText(/Any 2 of 3 guardians/)).toBeInTheDocument();
  });
});

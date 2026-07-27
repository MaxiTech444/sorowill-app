import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GuardianPanel } from '@/components/GuardianPanel';

vi.mock('@/lib/freighter', () => ({
  truncateAddress: (addr: string) => addr.length > 12 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr,
}));

describe('GuardianPanel', () => {
  it('shows empty state when no guardians', () => {
    render(<GuardianPanel guardians={[]} guardianVotes={0} />);
    expect(screen.getByText('No guardians configured for this will.')).toBeInTheDocument();
  });

  it('renders guardian addresses', () => {
    const guardians = ['GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890AB', 'GXYZABC1234567890ABCDEF1234567890ABCDEF1234567890AB'];
    render(<GuardianPanel guardians={guardians} guardianVotes={0} />);
    expect(screen.getByText('GABC...7890')).toBeInTheDocument();
    expect(screen.getByText('GXYZ...7890')).toBeInTheDocument();
  });

  it('displays vote count', () => {
    render(<GuardianPanel guardians={['GA1234567890ABCDEF1234567890ABCDEF1234567890AB', 'GB1234567890ABCDEF1234567890ABCDEF1234567890AB']} guardianVotes={1} />);
    expect(screen.getByText('1/2 votes')).toBeInTheDocument();
  });

  it('clamps displayed votes to threshold', () => {
    render(<GuardianPanel guardians={['GA1234567890ABCDEF1234567890ABCDEF1234567890AB', 'GB1234567890ABCDEF1234567890ABCDEF1234567890AB']} guardianVotes={5} />);
    expect(screen.getByText('2/2 votes')).toBeInTheDocument();
  });

  it('shows threshold description', () => {
    render(<GuardianPanel guardians={['GA1234567890ABCDEF1234567890ABCDEF1234567890AB', 'GB1234567890ABCDEF1234567890ABCDEF1234567890AB', 'GC1234567890ABCDEF1234567890ABCDEF1234567890AB']} guardianVotes={0} />);
    expect(screen.getByText(/Any 2 of 3 guardians/)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NetworkBadge } from '@/components/NetworkBadge';

describe('NetworkBadge', () => {
  it('renders network badge with current network', () => {
    render(<NetworkBadge />);
    const badge = screen.getByLabelText(/current network/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(/testnet|mainnet/i);
  });
});

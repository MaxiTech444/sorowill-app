import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HeaderContextArea } from '@/components/HeaderContextArea';

// Mock freighter lib
vi.mock('@/lib/freighter', () => ({
  safeGetPublicKey: vi.fn().mockResolvedValue(null),
  safeGetWalletNetwork: vi.fn().mockResolvedValue(null),
  truncateAddress: (addr: string) => addr,
}));

describe('HeaderContextArea', () => {
  it('renders unified header context controls', () => {
    render(<HeaderContextArea />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatusBanner } from '@/components/StatusBanner';
import { WillStatus } from '@sorowill/sdk';

vi.mock('@sorowill/sdk', () => ({
  WillStatus: { Active: 'Active', Triggered: 'Triggered', Released: 'Released', Cancelled: 'Cancelled' },
}));

describe('StatusBanner', () => {
  it('renders compact Active status', () => {
    render(<StatusBanner status={WillStatus.Active} compact />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders compact Triggered status', () => {
    render(<StatusBanner status={WillStatus.Triggered} compact />);
    expect(screen.getByText('Triggered — grace period running')).toBeInTheDocument();
  });

  it('renders compact Released status', () => {
    render(<StatusBanner status={WillStatus.Released} compact />);
    expect(screen.getByText('Released')).toBeInTheDocument();
  });

  it('renders compact Cancelled status', () => {
    render(<StatusBanner status={WillStatus.Cancelled} compact />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('renders full banner with description for Active', () => {
    render(<StatusBanner status={WillStatus.Active} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('This will is active. The owner is checking in on schedule.')).toBeInTheDocument();
  });

  it('renders full banner with description for Triggered', () => {
    render(<StatusBanner status={WillStatus.Triggered} />);
    expect(screen.getByText('Triggered — grace period running')).toBeInTheDocument();
    expect(screen.getByText('A check-in deadline was missed. The owner can still prove they are alive.')).toBeInTheDocument();
  });

  it('renders full banner with description for Released', () => {
    render(<StatusBanner status={WillStatus.Released} />);
    expect(screen.getByText('Released')).toBeInTheDocument();
    expect(screen.getByText('The inheritance has been distributed to all beneficiaries.')).toBeInTheDocument();
  });

  it('renders full banner with description for Cancelled', () => {
    render(<StatusBanner status={WillStatus.Cancelled} />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('The owner cancelled this will and withdrew the balance.')).toBeInTheDocument();
  });

  it('defaults to non-compact mode', () => {
    const { container } = render(<StatusBanner status={WillStatus.Active} />);
    const banner = container.querySelector('.w-full');
    expect(banner).toBeInTheDocument();
  });
});

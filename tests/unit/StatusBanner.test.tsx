import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatusBanner } from '@/components/StatusBanner';
import { WillStatus } from '@sorowill/sdk';

vi.mock('@sorowill/sdk', () => ({
  WillStatus: {
    Active: 'Active',
    Triggered: 'Triggered',
    Released: 'Released',
    Cancelled: 'Cancelled',
  },
}));

// Expected config values mirrored from STATUS_CONFIG in StatusBanner.tsx
const EXPECTED = {
  [WillStatus.Active]: {
    label: 'Active',
    description: 'This will is active. The owner is checking in on schedule.',
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  [WillStatus.Triggered]: {
    label: 'Triggered — grace period running',
    description: 'A check-in deadline was missed. The owner can still prove they are alive.',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  [WillStatus.Released]: {
    label: 'Released',
    description: 'The inheritance has been distributed to all beneficiaries.',
    className: 'bg-will-purple/20 text-indigo-200 border-will-purple/40',
  },
  [WillStatus.Cancelled]: {
    label: 'Cancelled',
    description: 'The owner cancelled this will and withdrew the balance.',
    className: 'bg-white/10 text-will-light/60 border-white/20',
  },
} as const;

const ALL_STATUSES = [
  WillStatus.Active,
  WillStatus.Triggered,
  WillStatus.Released,
  WillStatus.Cancelled,
] as const;

// ─── Compact mode ────────────────────────────────────────────────────────────

describe('StatusBanner — compact mode', () => {
  it.each(ALL_STATUSES)('renders the correct label for %s', (status) => {
    render(<StatusBanner status={status} compact />);
    expect(screen.getByText(EXPECTED[status].label)).toBeInTheDocument();
  });

  it.each(ALL_STATUSES)('does NOT render the description for %s', (status) => {
    render(<StatusBanner status={status} compact />);
    expect(screen.queryByText(EXPECTED[status].description)).not.toBeInTheDocument();
  });

  it.each(ALL_STATUSES)('applies the correct styling classes for %s', (status) => {
    const { container } = render(<StatusBanner status={status} compact />);
    const pill = container.querySelector('span');
    expect(pill).toBeInTheDocument();
    for (const cls of EXPECTED[status].className.split(' ')) {
      expect(pill).toHaveClass(cls);
    }
  });

  it.each(ALL_STATUSES)('renders as an inline span (pill) for %s', (status) => {
    const { container } = render(<StatusBanner status={status} compact />);
    expect(container.querySelector('span')).toBeInTheDocument();
    expect(container.querySelector('.w-full')).not.toBeInTheDocument();
  });
});

// ─── Full-banner mode ────────────────────────────────────────────────────────

describe('StatusBanner — full mode', () => {
  it.each(ALL_STATUSES)('renders the correct label for %s', (status) => {
    render(<StatusBanner status={status} />);
    expect(screen.getByText(EXPECTED[status].label)).toBeInTheDocument();
  });

  it.each(ALL_STATUSES)('renders the correct description for %s', (status) => {
    render(<StatusBanner status={status} />);
    expect(screen.getByText(EXPECTED[status].description)).toBeInTheDocument();
  });

  it.each(ALL_STATUSES)('applies the correct styling classes for %s', (status) => {
    const { container } = render(<StatusBanner status={status} />);
    const banner = container.querySelector('.w-full');
    expect(banner).toBeInTheDocument();
    for (const cls of EXPECTED[status].className.split(' ')) {
      expect(banner).toHaveClass(cls);
    }
  });

  it.each(ALL_STATUSES)('renders as a full-width div for %s', (status) => {
    const { container } = render(<StatusBanner status={status} />);
    expect(container.querySelector('.w-full')).toBeInTheDocument();
  });
});

// ─── Default behaviour ───────────────────────────────────────────────────────

describe('StatusBanner — default behaviour', () => {
  it('defaults to full (non-compact) mode when compact prop is omitted', () => {
    const { container } = render(<StatusBanner status={WillStatus.Active} />);
    expect(container.querySelector('.w-full')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CountdownTimer } from '@/components/CountdownTimer';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CountdownTimer', () => {
  it('renders the countdown in DD:HH:MM:SS format', () => {
    const future = new Date(Date.now() + 86_400_000 + 3_600_000 + 60_000 + 1000);
    render(<CountdownTimer deadline={future} />);
    expect(screen.getByText('01:01:01:01')).toBeInTheDocument();
  });

  it('shows overdue when deadline is in the past', () => {
    const past = new Date(Date.now() - 1000);
    render(<CountdownTimer deadline={past} />);
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    const future = new Date(Date.now() + 86_400_000);
    render(<CountdownTimer deadline={future} label="Next check-in due" />);
    expect(screen.getByText('Next check-in due')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    const future = new Date(Date.now() + 86_400_000);
    const { container } = render(<CountdownTimer deadline={future} />);
    expect(container.querySelector('span.text-xs')).not.toBeInTheDocument();
  });

  it('updates every second via setInterval', () => {
    vi.useFakeTimers();
    const base = Date.now() + 86_400_000 + 1_000;
    const future = new Date(base);
    render(<CountdownTimer deadline={future} />);
    expect(screen.getByText('01:00:00:01')).toBeInTheDocument();

    vi.advanceTimersByTime(2000);
    expect(screen.getByText('01:00:00:00')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('applies green color for >3 days', () => {
    const future = new Date(Date.now() + 86_400_000 * 5);
    render(<CountdownTimer deadline={future} />);
    const span = screen.getByText(/^\d{2}:\d{2}:\d{2}:\d{2}$/);
    expect(span.className).toContain('text-emerald-400');
  });

  it('applies amber color for <3 days', () => {
    const future = new Date(Date.now() + 86_400_000 * 2);
    render(<CountdownTimer deadline={future} />);
    const span = screen.getByText(/^\d{2}:\d{2}:\d{2}:\d{2}$/);
    expect(span.className).toContain('text-amber-400');
  });

  it('applies red color for overdue', () => {
    const past = new Date(Date.now() - 1000);
    render(<CountdownTimer deadline={past} />);
    const span = screen.getByText(/overdue/i);
    expect(span.className).toContain('text-red-400');
  });
});

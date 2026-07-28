import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { GuardianForm } from '@/components/GuardianForm';

vi.mock('@/lib/freighter', () => ({
  truncateAddress: (addr: string) => addr.length > 12 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr,
}));

const MAX_GUARDIANS = 5;

describe('GuardianForm', () => {
  it('renders with empty state', () => {
    render(<GuardianForm guardians={[]} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /add guardian/i })).toBeInTheDocument();
  });

  it('renders guardian addresses', () => {
    const guardians = [
      'GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890AB',
      'GXYZABC1234567890ABCDEF1234567890ABCDEF1234567890AB',
    ];
    render(<GuardianForm guardians={guardians} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890AB')).toBeInTheDocument();
    expect(screen.getByDisplayValue('GXYZABC1234567890ABCDEF1234567890ABCDEF1234567890AB')).toBeInTheDocument();
  });

  it('calls onChange when adding a guardian', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<GuardianForm guardians={[]} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /add guardian/i }));
    expect(onChange).toHaveBeenCalledWith(['']);
  });

  it('calls onChange when removing a guardian', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const guardians = [
      'GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890AB',
      'GXYZABC1234567890ABCDEF1234567890ABCDEF1234567890AB',
    ];
    render(<GuardianForm guardians={guardians} onChange={onChange} />);
    const removeButtons = screen.getAllByRole('button', { name: /remove guardian/i });
    await user.click(removeButtons[0]);
    expect(onChange).toHaveBeenCalledWith([guardians[1]]);
  });

  it('disables add button when max guardians reached', () => {
    const maxGuardians = Array.from({ length: MAX_GUARDIANS }, (_, i) =>
      `GA${String(i).padStart(54, 'A')}`
    );
    render(<GuardianForm guardians={maxGuardians} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /add guardian/i })).toBeDisabled();
  });

  it('shows clear message when max guardians limit reached', () => {
    const maxGuardians = Array.from({ length: MAX_GUARDIANS }, (_, i) =>
      `GA${String(i).padStart(54, 'A')}`
    );
    render(<GuardianForm guardians={maxGuardians} onChange={vi.fn()} />);
    expect(screen.getByText(new RegExp(`You can add up to ${MAX_GUARDIANS} guardians`, 'i'))).toBeInTheDocument();
  });

  it('calls onChange when updating guardian address', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<GuardianForm guardians={['']} onChange={onChange} />);
    await user.type(screen.getByPlaceholderText(/stellar address/i), 'GNEW');
    expect(onChange).toHaveBeenCalled();
  });

  it('allows adding guardians below max limit', async () => {
    const user = userEvent.setup();
    const guardians = Array.from({ length: MAX_GUARDIANS - 1 }, (_, i) =>
      `GA${String(i).padStart(54, 'a')}`
    );
    const onChange = vi.fn();
    render(<GuardianForm guardians={guardians} onChange={onChange} />);
    const addButton = screen.getByRole('button', { name: /add guardian/i });
    expect(addButton).not.toBeDisabled();
    await user.click(addButton);
    expect(onChange).toHaveBeenCalled();
  });

  it('displays guardian count', () => {
    const guardians = Array.from({ length: 3 }, (_, i) =>
      `GA${String(i).padStart(54, 'a')}`
    );
    render(<GuardianForm guardians={guardians} onChange={vi.fn()} />);
    expect(screen.getByText(/3 guardians/i)).toBeInTheDocument();
  });
});

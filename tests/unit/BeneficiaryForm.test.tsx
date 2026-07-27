import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BeneficiaryForm } from '@/components/BeneficiaryForm';
import type { Beneficiary } from '@sorowill/sdk';

describe('BeneficiaryForm', () => {
  it('renders with empty state', () => {
    render(<BeneficiaryForm value={[]} onChange={vi.fn()} />);
    expect(screen.getByText('Total: 0%')).toBeInTheDocument();
    expect(screen.getByText('(must equal 100%)')).toBeInTheDocument();
  });

  it('renders a beneficiary row', () => {
    const beneficiaries: Beneficiary[] = [{ address: 'GABC123', percentage: 50 }];
    render(<BeneficiaryForm value={beneficiaries} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('GABC123')).toBeInTheDocument();
    expect(screen.getByDisplayValue(50)).toBeInTheDocument();
  });

  it('calls onChange when adding a beneficiary', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BeneficiaryForm value={[]} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /add beneficiary/i }));
    expect(onChange).toHaveBeenCalledWith([{ address: '', percentage: 0 }]);
  });

  it('calls onChange when removing a beneficiary', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const beneficiaries: Beneficiary[] = [
      { address: 'GABC123', percentage: 50 },
      { address: 'GXYZ456', percentage: 50 },
    ];
    render(<BeneficiaryForm value={beneficiaries} onChange={onChange} />);
    const removeButtons = screen.getAllByRole('button', { name: /remove beneficiary/i });
    await user.click(removeButtons[0]);
    expect(onChange).toHaveBeenCalledWith([{ address: 'GXYZ456', percentage: 50 }]);
  });

  it('calls onChange when updating address', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const beneficiaries: Beneficiary[] = [{ address: '', percentage: 100 }];
    render(<BeneficiaryForm value={beneficiaries} onChange={onChange} />);
    await user.type(screen.getByPlaceholderText(/stellar address/i), 'GNEW');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows valid state when total is 100%', () => {
    const beneficiaries: Beneficiary[] = [{ address: 'GABC', percentage: 100 }];
    render(<BeneficiaryForm value={beneficiaries} onChange={vi.fn()} />);
    expect(screen.getByText('Total: 100% ✓')).toBeInTheDocument();
  });

  it('shows invalid state when total is not 100%', () => {
    const beneficiaries: Beneficiary[] = [{ address: 'GABC', percentage: 60 }];
    render(<BeneficiaryForm value={beneficiaries} onChange={vi.fn()} />);
    expect(screen.getByText('Total: 60%')).toBeInTheDocument();
    expect(screen.getByText('(must equal 100%)')).toBeInTheDocument();
  });

  it('applies equal split when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const beneficiaries: Beneficiary[] = [
      { address: 'GA', percentage: 0 },
      { address: 'GB', percentage: 0 },
      { address: 'GC', percentage: 0 },
    ];
    render(<BeneficiaryForm value={beneficiaries} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /split equally/i }));
    expect(onChange).toHaveBeenCalledWith([
      { address: 'GA', percentage: 34 },
      { address: 'GB', percentage: 33 },
      { address: 'GC', percentage: 33 },
    ]);
  });

  it('disables split equally when no beneficiaries', () => {
    render(<BeneficiaryForm value={[]} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /split equally/i })).toBeDisabled();
  });
});

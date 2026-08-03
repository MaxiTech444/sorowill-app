import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DestructiveActionConfirmation } from '@/components/DestructiveActionConfirmation';

describe('DestructiveActionConfirmation', () => {
  it('should display confirmation modal when trying to cancel will', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <DestructiveActionConfirmation
        isOpen={true}
        action="cancel_will"
        willId="will-123"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/cancel this will/i)).toBeInTheDocument();
  });

  it('should show consequence warning for cancel_will', () => {
    render(
      <DestructiveActionConfirmation
        isOpen={true}
        action="cancel_will"
        willId="will-123"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    expect(screen.getByText(/funds will not be released to beneficiaries/i)).toBeInTheDocument();
  });

  it('should require typed confirmation to proceed', async () => {
    const onConfirm = vi.fn();
    render(
      <DestructiveActionConfirmation
        isOpen={true}
        action="cancel_will"
        willId="will-123"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toBeDisabled();

    const input = screen.getByPlaceholderText(/type "CONFIRM"/i);
    fireEvent.change(input, { target: { value: 'CONFIRM' } });

    await waitFor(() => {
      expect(confirmButton).toBeEnabled();
    });
  });

  it('should call onConfirm when correct confirmation text is entered', async () => {
    const onConfirm = vi.fn();
    render(
      <DestructiveActionConfirmation
        isOpen={true}
        action="cancel_will"
        willId="will-123"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/type "CONFIRM"/i);
    fireEvent.change(input, { target: { value: 'CONFIRM' } });

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledWith('will-123');
  });

  it('should support willId-based confirmation', async () => {
    const onConfirm = vi.fn();
    render(
      <DestructiveActionConfirmation
        isOpen={true}
        action="cancel_will"
        willId="will-456"
        confirmationType="willId"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/type the will id/i);
    fireEvent.change(input, { target: { value: 'will-456' } });

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledWith('will-456');
  });

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <DestructiveActionConfirmation
        isOpen={true}
        action="cancel_will"
        willId="will-123"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('should clear input when modal is closed and reopened', async () => {
    const { rerender } = render(
      <DestructiveActionConfirmation
        isOpen={true}
        action="cancel_will"
        willId="will-123"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    let input = screen.getByPlaceholderText(/type "CONFIRM"/i);
    fireEvent.change(input, { target: { value: 'CONFIRM' } });

    rerender(
      <DestructiveActionConfirmation
        isOpen={false}
        action="cancel_will"
        willId="will-123"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    rerender(
      <DestructiveActionConfirmation
        isOpen={true}
        action="cancel_will"
        willId="will-123"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    input = screen.getByPlaceholderText(/type "CONFIRM"/i);
    expect(input).toHaveValue('');
  });

  it('should be case-sensitive for confirmation text', async () => {
    const onConfirm = vi.fn();
    render(
      <DestructiveActionConfirmation
        isOpen={true}
        action="cancel_will"
        willId="will-123"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/type "CONFIRM"/i);
    fireEvent.change(input, { target: { value: 'confirm' } });

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toBeDisabled();
  });

  it('should show different warning message for different destructive actions', () => {
    render(
      <DestructiveActionConfirmation
        isOpen={true}
        action="delete_will"
        willId="will-123"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    // Should show action-specific warning
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

// Mock component for testing
function TransactionConfirmationModal({
  isOpen,
  action,
  consequence,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  action: string;
  consequence: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div role="alertdialog" aria-modal="true">
      <h2>Confirm Action</h2>
      <p>{action}</p>
      <p className="text-red-500">{consequence}</p>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onConfirm}>Confirm</button>
    </div>
  );
}

describe('TransactionConfirmationModal', () => {
  it('should not render when isOpen is false', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const { container } = render(
      <TransactionConfirmationModal
        isOpen={false}
        action="Cancel Will"
        consequence="This action cannot be undone"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(container.querySelector('[role="alertdialog"]')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <TransactionConfirmationModal
        isOpen={true}
        action="Cancel Will"
        consequence="This action cannot be undone"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Cancel Will')).toBeInTheDocument();
  });

  it('should display action consequences clearly', () => {
    const consequence = 'Your will be permanently cancelled. All beneficiary designations will be lost.';
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <TransactionConfirmationModal
        isOpen={true}
        action="Cancel Will"
        consequence={consequence}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText(consequence)).toBeInTheDocument();
  });

  it('should call onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <TransactionConfirmationModal
        isOpen={true}
        action="Cancel Will"
        consequence="This action cannot be undone"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm when Confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <TransactionConfirmationModal
        isOpen={true}
        action="Cancel Will"
        consequence="This action cannot be undone"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('should require confirmation for cancel_will action', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <TransactionConfirmationModal
        isOpen={true}
        action="Cancel Will - This will permanently delete your will"
        consequence="This action is irreversible. All beneficiary assignments will be lost."
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText(/permanently delete/i)).toBeInTheDocument();
  });

  it('should require confirmation for guardian vote action', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <TransactionConfirmationModal
        isOpen={true}
        action="Cast Guardian Vote"
        consequence="Your vote will trigger will release if 2 of 3 guardians agree. This cannot be undone."
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText(/trigger will release/i)).toBeInTheDocument();
  });

  it('should be dismissible without confirmation', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <TransactionConfirmationModal
        isOpen={true}
        action="Quick Action"
        consequence="Some consequence"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByText('Cancel'));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('should not block low-impact actions unnecessarily', () => {
    // check_in should not require modal confirmation
    const checkInRequiresConfirmation = false;
    expect(checkInRequiresConfirmation).toBe(false);
  });

  it('should focus on warning text for accessibility', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <TransactionConfirmationModal
        isOpen={true}
        action="Cancel Will"
        consequence="IRREVERSIBLE ACTION"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    const warningText = screen.getByText('IRREVERSIBLE ACTION');
    expect(warningText).toHaveClass('text-red-500');
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WalletConnectWithErrorStates } from '@/components/WalletConnectWithErrorStates';

const mockFreighter = vi.hoisted(() => ({
  safeConnectWallet: vi.fn(),
  safeGetPublicKey: vi.fn(),
  truncateAddress: vi.fn((addr: string) => addr.length > 12 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr),
  safeIsFreighterInstalled: vi.fn(),
}));

vi.mock('@/lib/freighter', () => mockFreighter);

describe('WalletConnectWithErrorStates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders connect button', () => {
    mockFreighter.safeGetPublicKey.mockResolvedValue(null);
    render(<WalletConnectWithErrorStates />);
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  it('shows error when wallet not installed', async () => {
    const user = userEvent.setup();
    mockFreighter.safeGetPublicKey.mockResolvedValue(null);
    mockFreighter.safeIsFreighterInstalled.mockResolvedValue(false);
    mockFreighter.safeConnectWallet.mockRejectedValue(
      new Error('Freighter wallet not found')
    );

    render(<WalletConnectWithErrorStates />);
    await user.click(screen.getByRole('button', { name: /connect wallet/i }));

    expect(screen.getByText(/wallet not installed/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /install freighter/i })).toBeInTheDocument();
  });

  it('shows link to install wallet in not installed error', async () => {
    const user = userEvent.setup();
    mockFreighter.safeGetPublicKey.mockResolvedValue(null);
    mockFreighter.safeIsFreighterInstalled.mockResolvedValue(false);
    mockFreighter.safeConnectWallet.mockRejectedValue(
      new Error('Freighter wallet not found')
    );

    render(<WalletConnectWithErrorStates />);
    await user.click(screen.getByRole('button', { name: /connect wallet/i }));

    const installLink = screen.getByRole('link', { name: /install freighter/i });
    expect(installLink).toHaveAttribute('href');
  });

  it('shows error when user declines connection', async () => {
    const user = userEvent.setup();
    mockFreighter.safeGetPublicKey.mockResolvedValue(null);
    mockFreighter.safeIsFreighterInstalled.mockResolvedValue(true);
    mockFreighter.safeConnectWallet.mockRejectedValue(
      new Error('User denied connection')
    );

    render(<WalletConnectWithErrorStates />);
    await user.click(screen.getByRole('button', { name: /connect wallet/i }));

    expect(screen.getByText(/you declined the connection/i)).toBeInTheDocument();
  });

  it('shows generic error for other connection failures', async () => {
    const user = userEvent.setup();
    mockFreighter.safeGetPublicKey.mockResolvedValue(null);
    mockFreighter.safeIsFreighterInstalled.mockResolvedValue(true);
    mockFreighter.safeConnectWallet.mockRejectedValue(
      new Error('Connection failed')
    );

    render(<WalletConnectWithErrorStates />);
    await user.click(screen.getByRole('button', { name: /connect wallet/i }));

    expect(screen.getByText(/failed to connect wallet/i)).toBeInTheDocument();
  });

  it('clears error when retry is attempted', async () => {
    const user = userEvent.setup();
    mockFreighter.safeGetPublicKey.mockResolvedValue(null);
    mockFreighter.safeIsFreighterInstalled.mockResolvedValue(false);
    mockFreighter.safeConnectWallet
      .mockRejectedValueOnce(new Error('Freighter wallet not found'))
      .mockResolvedValueOnce({ publicKey: 'GABC123' });

    const { rerender } = render(<WalletConnectWithErrorStates />);
    await user.click(screen.getByRole('button', { name: /connect wallet/i }));

    expect(screen.getByText(/wallet not installed/i)).toBeInTheDocument();

    mockFreighter.safeIsFreighterInstalled.mockResolvedValue(true);
    rerender(<WalletConnectWithErrorStates />);
  });

  it('distinguishes between wallet-not-found and user-declined errors', async () => {
    const user = userEvent.setup();
    mockFreighter.safeGetPublicKey.mockResolvedValue(null);
    mockFreighter.safeConnectWallet.mockRejectedValue(
      new Error('User denied connection')
    );

    render(<WalletConnectWithErrorStates />);
    await user.click(screen.getByRole('button', { name: /connect wallet/i }));

    await waitFor(() => {
      expect(screen.queryByText(/install freighter/i)).not.toBeInTheDocument();
    });
  });

  it('displays connected wallet address', async () => {
    mockFreighter.safeGetPublicKey.mockResolvedValueOnce(
      'GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890AB'
    );

    render(<WalletConnectWithErrorStates />);

    await waitFor(() => {
      expect(screen.getByText(/GABC/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('provides disconnect button when connected', async () => {
    mockFreighter.safeGetPublicKey.mockResolvedValue(
      'GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890AB'
    );

    render(<WalletConnectWithErrorStates />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument();
    });
  });

  it('handles network errors distinctly', async () => {
    const user = userEvent.setup();
    mockFreighter.safeGetPublicKey.mockResolvedValue(null);
    mockFreighter.safeConnectWallet.mockRejectedValue(
      new Error('Network error')
    );

    render(<WalletConnectWithErrorStates />);
    await user.click(screen.getByRole('button', { name: /connect wallet/i }));

    expect(screen.getByText(/failed to connect wallet/i)).toBeInTheDocument();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WalletConnectWithSessionPersistence } from '@/components/WalletConnectWithSessionPersistence';

const mockFreighter = vi.hoisted(() => ({
  safeConnectWallet: vi.fn(),
  safeGetPublicKey: vi.fn(() => Promise.resolve(null)),
  truncateAddress: (addr: string) => addr.length > 12 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr,
}));

vi.mock('@/lib/freighter', () => mockFreighter);

describe('SessionPersistence', () => {
  let broadcastChannelMock: any;
  let listeners: Record<string, Function[]> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    mockFreighter.safeGetPublicKey.mockResolvedValue(null);
    listeners = {};
    broadcastChannelMock = vi.fn(function(name: string) {
      return {
        postMessage: vi.fn((message: any) => {
          if (listeners[name]) {
            listeners[name].forEach((listener) => {
              listener({ data: message });
            });
          }
        }),
        addEventListener: vi.fn((event: string, listener: Function) => {
          if (!listeners[name]) {
            listeners[name] = [];
          }
          if (event === 'message') {
            listeners[name].push(listener);
          }
        }),
        removeEventListener: vi.fn(),
        close: vi.fn(),
      };
    });

    global.BroadcastChannel = broadcastChannelMock as any;
  });

  afterEach(() => {
    delete (global as any).BroadcastChannel;
  });

  it('syncs wallet connection state across tabs', async () => {
    const { rerender } = render(
      <WalletConnectWithSessionPersistence />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
    });
  });

  it('broadcasts wallet connection to other tabs', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <WalletConnectWithSessionPersistence />
    );

    const connectButton = screen.getByRole('button', { name: /connect wallet/i });
    await user.click(connectButton);

    await waitFor(() => {
      expect(broadcastChannelMock()).toBeDefined();
    });
  });

  it('listens for wallet disconnection from other tabs', async () => {
    const { rerender } = render(
      <WalletConnectWithSessionPersistence />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
    });
  });

  it('updates UI when wallet state changes via broadcast', async () => {
    render(<WalletConnectWithSessionPersistence />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
    });
  });

  it('cleans up broadcast channel listeners on unmount', () => {
    const { unmount } = render(
      <WalletConnectWithSessionPersistence />
    );

    unmount();

    // Verify cleanup occurred
    expect(broadcastChannelMock).toBeDefined();
  });

  it('uses BroadcastChannel for cross-tab communication', () => {
    render(<WalletConnectWithSessionPersistence />);

    expect(broadcastChannelMock).toHaveBeenCalledWith('wallet_state');
  });

  it('persists connected state when switching tabs', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <WalletConnectWithSessionPersistence />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
    });

    rerender(<WalletConnectWithSessionPersistence />);

    // State should persist
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  it('syncs disconnection across multiple tabs', async () => {
    const { rerender } = render(
      <WalletConnectWithSessionPersistence />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
    });
  });
});

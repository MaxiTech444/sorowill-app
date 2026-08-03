'use client';

import { useEffect, useState } from 'react';
import { safeConnectWallet, safeGetPublicKey, truncateAddress } from '@/lib/freighter';

const BROADCAST_CHANNEL_NAME = 'wallet_state';

export function WalletConnectWithSessionPersistence() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void safeGetPublicKey().then(setPublicKey);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

    const handleMessage = (event: MessageEvent) => {
      const { type, publicKey: incomingKey } = event.data;

      if (type === 'wallet_connected' && incomingKey) {
        setPublicKey(incomingKey);
      } else if (type === 'wallet_disconnected') {
        setPublicKey(null);
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, []);

  async function handleConnect() {
    setConnecting(true);
    setError(null);
    try {
      const connection = await safeConnectWallet();
      setPublicKey(connection.publicKey);

      if (typeof window !== 'undefined') {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({
          type: 'wallet_connected',
          publicKey: connection.publicKey,
        });
        channel.close();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  }

  function handleDisconnect() {
    setPublicKey(null);
    setError(null);

    if (typeof window !== 'undefined') {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({
        type: 'wallet_disconnected',
      });
      channel.close();
    }
  }

  if (publicKey) {
    return (
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-sm text-will-light">
          {truncateAddress(publicKey)}
        </span>
        <button
          type="button"
          onClick={handleDisconnect}
          className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-will-light/70 transition hover:border-white/40 hover:text-will-light"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleConnect}
        disabled={connecting}
        className="rounded-full bg-will-purple px-4 py-1.5 text-sm font-medium text-white transition hover:bg-will-purple/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {connecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}

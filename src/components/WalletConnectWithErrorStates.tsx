'use client';

import { useEffect, useState } from 'react';
import {
  safeConnectWallet,
  safeGetPublicKey,
  safeIsFreighterInstalled,
  truncateAddress,
} from '@/lib/freighter';

type ErrorType = 'not_installed' | 'user_declined' | 'generic' | null;

interface ErrorInfo {
  type: ErrorType;
  message: string;
}

export function WalletConnectWithErrorStates() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    safeGetPublicKey().then(setPublicKey);
  }, []);

  async function handleConnect() {
    setConnecting(true);
    setError(null);
    try {
      const connection = await safeConnectWallet();
      setPublicKey(connection.publicKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';

      let errorType: ErrorType = 'generic';

      if (
        errorMessage.includes('Freighter') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('not installed')
      ) {
        errorType = 'not_installed';
      } else if (
        errorMessage.includes('declined') ||
        errorMessage.includes('denied') ||
        errorMessage.includes('rejected')
      ) {
        errorType = 'user_declined';
      }

      setError({
        type: errorType,
        message: errorMessage,
      });
    } finally {
      setConnecting(false);
    }
  }

  function handleDisconnect() {
    setPublicKey(null);
    setError(null);
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
      {error ? (
        <div className="text-xs text-red-400 text-right max-w-xs">
          {error.type === 'not_installed' ? (
            <>
              <p className="mb-1">Freighter wallet not installed. Install it to continue.</p>
              <a
                href="https://www.freighter.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-300 hover:text-red-200 underline"
              >
                Install Freighter
              </a>
            </>
          ) : error.type === 'user_declined' ? (
            <p>You declined the connection. Try again when ready.</p>
          ) : (
            <p>Failed to connect wallet. Please try again.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

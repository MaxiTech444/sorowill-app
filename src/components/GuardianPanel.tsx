import { useState } from 'react';
import { truncateAddress } from '@/lib/freighter';

const GUARDIAN_THRESHOLD = 2;

export interface GuardianPanelProps {
  guardians: string[];
  guardianVotes: number;
  isOwner?: boolean;
  willId?: string;
}

export function GuardianPanel({ guardians, guardianVotes, isOwner, willId }: GuardianPanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (guardians.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-semibold text-will-light">Guardians</h3>
        <p className="mt-1 text-sm text-will-light/60">No guardians configured for this will.</p>
      </div>
    );
  }

  const handleCopy = async (index: number) => {
    if (typeof window === 'undefined' || !willId) return;
    const inviteUrl = `${window.location.origin}/guardian/onboard?willId=${willId}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy invite link', err);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-will-light">Guardians</h3>
        <span className="font-mono text-sm text-will-light/70">
          {Math.min(guardianVotes, GUARDIAN_THRESHOLD)}/{GUARDIAN_THRESHOLD} votes
        </span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: GUARDIAN_THRESHOLD }).map((_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-full ${
              index < guardianVotes ? 'bg-will-purple' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {guardians.map((guardian, index) => (
          <li key={guardian} className="flex items-center justify-between font-mono text-sm text-will-light/80">
            <span>{truncateAddress(guardian)}</span>
            {isOwner && willId && (
              <button
                type="button"
                onClick={() => handleCopy(index)}
                className={`rounded-full border px-2 py-0.5 text-xs transition font-sans ${
                  copiedIndex === index
                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                    : 'border-white/15 text-will-light/60 hover:text-will-light hover:border-white/30 bg-transparent'
                }`}
              >
                {copiedIndex === index ? 'Copied!' : 'Copy Invite'}
              </button>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-will-light/50">
        Any {GUARDIAN_THRESHOLD} of {guardians.length} guardians can force an early release.
      </p>
    </div>
  );
}


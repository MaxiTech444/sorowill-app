import { truncateAddress } from '@/lib/freighter';

const GUARDIAN_THRESHOLD = 2;

export interface GuardianPanelProps {
  guardians: string[];
  guardianVotes: number;
  isGuardian?: boolean;
  isActive?: boolean;
  isCastingVote?: boolean;
  onCastVote?: () => void;
  error?: string | null;
}

export function GuardianPanel({
  guardians,
  guardianVotes,
  isGuardian = false,
  isActive = false,
  isCastingVote = false,
  onCastVote,
  error,
}: GuardianPanelProps) {
  if (guardians.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg">👨‍⚖️</span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-will-light">No guardians</h3>
            <p className="mt-1 text-sm text-will-light/60">No guardians configured for this will. Guardians can force an early release if you're incapacitated.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4" aria-labelledby="guardians-heading">
      <div className="flex items-center justify-between">
        <h3 id="guardians-heading" className="text-sm font-semibold text-will-light">
          Guardians
        </h3>
        <span className="font-mono text-sm text-will-light/70" role="status" aria-label={`${Math.min(guardianVotes, GUARDIAN_THRESHOLD)} of ${GUARDIAN_THRESHOLD} guardian votes`}>
          {Math.min(guardianVotes, GUARDIAN_THRESHOLD)}/{GUARDIAN_THRESHOLD} votes
        </span>
      </div>
      <div
        className="mt-2 flex gap-1.5"
        role="progressbar"
        aria-valuenow={Math.min(guardianVotes, GUARDIAN_THRESHOLD)}
        aria-valuemin={0}
        aria-valuemax={GUARDIAN_THRESHOLD}
        aria-label="Guardian votes progress"
      >
        {Array.from({ length: GUARDIAN_THRESHOLD }).map((_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-full ${
              index < guardianVotes ? 'bg-will-purple' : 'bg-white/10'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5" aria-label="Guardian addresses">
        {guardians.map((guardian) => (
          <li key={guardian} className="font-mono text-sm text-will-light/80">
            {truncateAddress(guardian)}
          </li>
        ))}
      </ul>
      {isGuardian && isActive ? (
        <button
          type="button"
          onClick={onCastVote}
          disabled={isCastingVote}
          className="mt-3 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500/90 disabled:opacity-60"
        >
          {isCastingVote ? 'Casting vote…' : 'Cast guardian vote'}
        </button>
      ) : null}
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      <p className="mt-2 text-xs text-will-light/50">
        Any {GUARDIAN_THRESHOLD} of {guardians.length} guardians can force an early release.
      </p>
    </section>
  );
}

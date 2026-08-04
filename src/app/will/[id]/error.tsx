'use client';

// NOTE: This boundary does NOT catch the primary data-fetch failure for this
// route. `will/[id]/page.tsx` is a client component that loads its data
// inside useEffect/useCallback handlers wrapped in try/catch. Fetch failures
// are stored in local state and render an inline retry affordance, so they
// never throw into this boundary. This boundary only catches unexpected
// render-time errors elsewhere in the component tree.

import { formatError } from '@/lib/errors';

export default function WillDetailError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
      <h1 className="text-lg font-semibold text-red-300">Couldn&apos;t load this will</h1>
      <p className="mt-2 text-sm text-red-300/70">{formatError(error)}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full border border-red-400/40 px-4 py-2 text-sm text-red-300 transition hover:border-red-400/70"
      >
        Try again
      </button>
    </div>
  );
}

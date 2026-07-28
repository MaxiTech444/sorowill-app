import Link from 'next/link';

export default function VerifyNotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-white/5 p-8 text-center">
      <p className="text-4xl" aria-hidden="true">
        🔍
      </p>
      <h1 className="mt-4 text-lg font-semibold text-will-light">Will not found</h1>
      <p className="mt-2 text-sm text-will-light/60">
        No will with this ID exists on-chain. The link may be mistyped, or the will may have never
        been created.
      </p>
      <p className="mt-1 text-sm text-will-light/40">
        If you believe this is an error, double-check the will ID in the URL and try again.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full border border-white/20 px-5 py-2 text-sm text-will-light/70 transition hover:border-white/40 hover:text-will-light"
      >
        Go to home
      </Link>
    </div>
  );
}

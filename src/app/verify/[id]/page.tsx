import { notFound } from 'next/navigation';

import { formatDeadline, WillStatus } from '@sorowill/sdk';

import { truncateAddress } from '@/lib/freighter';
import { getContractId, getSoroWillClient, stellarExpertUrl } from '@/lib/sorowill';
import { StatusBanner } from '@/components/StatusBanner';
import { ShareVerification } from '@/components/ShareVerification';

function truncate(address: string): string {
  if (address.length <= 12) {
    return address;
  }
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Returns true when the error clearly indicates the will does not exist on
 * chain (contract-level "will not found" / "WillNotFound"). Transient RPC
 * errors will not match this pattern and are allowed to propagate to the
 * route's generic error boundary instead.
 */
function isWillNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  // The SDK throws: "SoroWill simulation failed for get_will: ..."
  // The Soroban contract returns error code #1 (WillNotFound).
  // Match on any combination of these signals so the check stays robust
  // even if the exact error string changes slightly.
  return (
    msg.includes('get_will') &&
    (msg.includes('willnotfound') ||
      msg.includes('not found') ||
      msg.includes('#1') ||
      msg.includes('error(contract, #1)') ||
      msg.includes('no such will'))
  );
}

export default async function VerifyPage({ params }: { params: { id: string } }) {
  let will;
  try {
    will = await getSoroWillClient().getWill(params.id);
  } catch (error) {
    if (isWillNotFoundError(error)) {
      notFound();
    }
    // Any other error (network timeout, RPC outage, …) re-throws so the
    // route-level error.tsx boundary can display it with a "Try again" button.
    throw error;
  }

  const nextDeadline = new Date(will.lastCheckin.getTime() + will.checkinPeriodDays * 86_400 * 1000);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="print-section">
        <h1 className="text-2xl font-bold text-will-light print-title">Verify Will #{will.id}</h1>
        <p className="print-hide mt-1 text-sm text-will-light/60">
          A public, read-only view of this will&apos;s on-chain state, straight from the SoroWill contract. No
          wallet is required to view this page.
        </p>
      </div>

      <StatusBanner status={will.status} />

      <div className="print-section rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-will-light print-heading">Beneficiaries</h2>
        <ul className="mt-2 space-y-1.5">
          {will.beneficiaries.map((beneficiary) => (
            <li key={beneficiary.address} className="flex justify-between text-sm">
              <span className="font-mono text-will-light/80">{truncateAddress(beneficiary.address)}</span>
              <span className="text-will-light">{beneficiary.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>

      {will.status === WillStatus.Active ? (
        <div className="print-section rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="text-xs uppercase tracking-wide text-will-light/60 print-text">Next check-in deadline</span>
          <p className="mt-1 text-lg font-semibold text-will-light print-text">{formatDeadline(nextDeadline)}</p>
        </div>
      ) : null}

      <div className="print-hide">
        <ShareVerification />
      </div>

      <a
        href={stellarExpertUrl('contract', getContractId())}
        target="_blank"
        rel="noreferrer"
        className="print-hide block rounded-full border border-white/20 px-4 py-3 text-center text-sm text-will-light/80 transition hover:border-white/40"
      >
        View SoroWill contract on Stellar Expert
      </a>
    </div>
  );
}

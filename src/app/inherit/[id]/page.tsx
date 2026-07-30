import type { Metadata } from 'next';

import { getSoroWillClient } from '@/lib/sorowill';
import { formatError } from '@/lib/errors';
import InheritPageClient from './InheritPageClient';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let title = 'Inheritance';
  let description = 'Claim your inheritance from a SoroWill.';

  try {
    const will = await getSoroWillClient().getWill(params.id);
    title = `Inheritance — Will #${will.id}`;
    description = `Claim your inheritance from Will #${will.id}. Status: ${will.status}. Locked balance: ${(Number(will.balance) / 1_000_000).toFixed(2)} USDC. ${will.beneficiaries.length} beneficiaries.`;
  } catch {
    // Graceful fallback — if the will fetch fails, keep generic metadata.
  }

  return { title, description };
}

export default async function InheritPage({ params }: { params: { id: string } }) {
  return <InheritPageClient id={params.id} />;
}

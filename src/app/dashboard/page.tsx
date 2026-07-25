'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { WillStatus, type Will } from '@sorowill/sdk';

import { safeGetPublicKey } from '@/lib/freighter';
import { getSoroWillClient } from '@/lib/sorowill';
import { WillCard } from '@/components/WillCard';

// TODO(#5): Add an activity feed (check-ins, top-ups, guardian votes) once
// @sorowill/sdk exposes an event subscription/query API — SoroWillClient
// currently only exposes will reads/writes, no event history.

type Tab = 'owned' | 'inheriting';
type StatusFilter = 'all' | WillStatus;

const STATUS_FILTERS: StatusFilter[] = ['all', WillStatus.Active, WillStatus.Triggered, WillStatus.Released, WillStatus.Cancelled];

function matchesSearch(will: Will, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  if (will.id.toLowerCase().includes(normalized)) {
    return true;
  }
  return will.beneficiaries.some((beneficiary) => beneficiary.address.toLowerCase().includes(normalized));
}

function CardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="space-y-2">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-3 w-40" />
      </div>
      <div className="skeleton h-8 w-20 rounded-full" />
    </div>
  );
}

export default function DashboardPage() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [checkedWallet, setCheckedWallet] = useState(false);
  const [tab, setTab] = useState<Tab>('owned');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [ownedWills, setOwnedWills] = useState<Will[]>([]);
  const [inheritingWills, setInheritingWills] = useState<Will[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  useEffect(() => {
    safeGetPublicKey().then((key) => {
      setPublicKey(key);
      setCheckedWallet(true);
    });
  }, []);

  const loadWills = useCallback(async (owner: string) => {
    setLoading(true);
    setError(null);
    try {
      const client = getSoroWillClient();
      const [owned, inheriting] = await Promise.all([
        client.getWillsByOwner(owner),
        client.getWillsByBeneficiary(owner),
      ]);
      setOwnedWills(owned);
      setInheritingWills(inheriting);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (publicKey) {
      loadWills(publicKey);
    }
  }, [publicKey, loadWills]);

  async function handleCheckIn(willId: string) {
    setCheckingInId(willId);
    try {
      await getSoroWillClient().checkIn(willId);
      if (publicKey) {
        await loadWills(publicKey);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check-in failed');
    } finally {
      setCheckingInId(null);
    }
  }

  if (checkedWallet && !publicKey) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-xl font-semibold text-will-light">Connect your wallet</h1>
        <p className="mt-2 text-sm text-will-light/60">
          Connect Freighter to see the wills you own and the ones you&apos;re a beneficiary of.
        </p>
      </div>
    );
  }

  const activeList = (tab === 'owned' ? ownedWills : inheritingWills).filter(
    (will) => matchesSearch(will, search) && (statusFilter === 'all' || will.status === statusFilter),
  );
  const isFiltering = search.trim() !== '' || statusFilter !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-will-light">Dashboard</h1>
        <Link
          href="/will/new"
          className="rounded-full bg-will-purple px-4 py-2 text-sm font-medium text-white transition hover:bg-will-purple/90"
        >
          + New Will
        </Link>
      </div>

      <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => setTab('owned')}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
            tab === 'owned' ? 'bg-will-purple text-white' : 'text-will-light/60 hover:text-will-light'
          }`}
        >
          My Wills
        </button>
        <button
          type="button"
          onClick={() => setTab('inheriting')}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
            tab === 'inheriting' ? 'bg-will-purple text-white' : 'text-will-light/60 hover:text-will-light'
          }`}
        >
          Inheriting
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by will ID or beneficiary address"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-will-light placeholder:text-will-light/40 focus:border-will-purple focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-will-light focus:border-will-purple focus:outline-none"
        >
          {STATUS_FILTERS.map((status) => (
            <option key={status} value={status} className="bg-will-dark">
              {status === 'all' ? 'All statuses' : status}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {loading ? (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : activeList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/20 p-8 text-center text-sm text-will-light/60">
          {isFiltering
            ? 'No wills match your search or filter.'
            : tab === 'owned'
              ? "You haven't created any wills yet."
              : "No one has named you as a beneficiary yet."}
        </div>
      ) : (
        <div className="space-y-3">
          {activeList.map((will) => (
            <WillCard
              key={will.id}
              will={will}
              onCheckIn={tab === 'owned' ? handleCheckIn : undefined}
              checkingIn={checkingInId === will.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

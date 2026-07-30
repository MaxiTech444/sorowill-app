'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

import Image from 'next/image';
import { WalletConnect } from '@/components/WalletConnect';
import { NetworkMismatchBanner } from '@/components/NetworkMismatchBanner';
import { NetworkSwitcher } from '@/components/NetworkSwitcher';
import { ToastProvider } from '@/components/Toast';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <header className="sticky top-0 z-10 border-b border-white/10 bg-will-dark/80 backdrop-blur dark:bg-will-dark/80">
        <NetworkMismatchBanner />
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-will-light">
            <Image src="/logo.svg" alt="SoroWill Logo" width={24} height={24} className="h-6 w-6 shrink-0" priority />
            Soro<span className="text-will-purple">Will</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-will-light/70 sm:flex">
            <Link href="/dashboard" className="hover:text-will-light">
              Dashboard
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-will-light/70 sm:flex">
              <Link href="/dashboard" className="hover:text-will-light">
                Dashboard
              </Link>
              <Link href="/will/new" className="hover:text-will-light">
                Create a Will
              </Link>
            </nav>
            <HeaderContextArea />
          </div>
        </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </ToastProvider>
    </ThemeProvider>
  );
}

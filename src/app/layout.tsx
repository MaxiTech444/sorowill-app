import type { Metadata } from 'next';

import ClientLayout from './layout-client';

import './globals.css';

export const metadata: Metadata = {
  title: 'SoroWill',
  description: 'Trustless on-chain inheritance on Stellar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-will-dark text-will-light antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

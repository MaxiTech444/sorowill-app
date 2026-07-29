import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import ClientLayout from './layout-client';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sorowill.vercel.app'),
  title: 'SoroWill',
  description: 'Trustless on-chain inheritance on Stellar',
  openGraph: {
    title: 'SoroWill',
    description: 'Trustless on-chain inheritance on Stellar',
    url: 'https://sorowill.vercel.app',
    siteName: 'SoroWill',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoroWill',
    description: 'Trustless on-chain inheritance on Stellar',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-will-dark text-will-light antialiased">
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import { Metadata } from 'next';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Changelog | SoroWill',
  description: 'SoroWill protocol updates and release notes',
};

const CHANGELOG_ENTRIES = [
  {
    version: 'v1.0.0',
    date: 'July 2026',
    title: 'Launch',
    highlights: [
      'Initial release of SoroWill on Stellar Soroban',
      'Core features: create wills, set beneficiaries, check-in mechanism',
      'Public stats page for protocol transparency',
      'Non-custodial smart contracts with immutable deployment',
      'Legal pages and privacy policy',
      'Open source under MIT license',
    ],
  },
  {
    version: 'v0.9.0',
    date: 'June 2026',
    title: 'Release Candidate',
    highlights: [
      'Dashboard for will management',
      'Verification flow for beneficiaries',
      'Guardian onboarding process',
      'Inheritance trigger mechanisms',
      'Contract integration testing',
    ],
  },
  {
    version: 'v0.5.0',
    date: 'April 2026',
    title: 'Testnet Alpha',
    highlights: [
      'Initial smart contract deployment on Soroban testnet',
      'Web interface prototype',
      'Wallet integration (Freighter)',
      'Basic check-in functionality',
      'Beneficiary configuration',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="space-y-8 pb-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-will-light">Changelog</h1>
        <p className="text-will-light/60">
          Protocol updates, new features, and improvements to SoroWill.
        </p>
      </section>

      <section className="space-y-8">
        {CHANGELOG_ENTRIES.map((entry, index) => (
          <div
            key={entry.version}
            className={`rounded-lg border bg-white/5 p-6 ${index === 0 ? 'border-will-purple' : 'border-white/10'}`}
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-will-light">{entry.version}</h2>
                <p className="text-sm text-will-light/60">{entry.title}</p>
              </div>
              <time className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-will-light/70">
                {entry.date}
              </time>
            </div>

            <ul className="mt-4 space-y-3">
              {entry.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-will-light/80">
                  <span className="shrink-0 text-will-purple">▸</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {index === 0 && (
              <div className="mt-4 rounded-lg border border-will-purple/30 bg-will-purple/10 p-3">
                <p className="text-sm text-will-purple">🚀 Latest Release</p>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-will-light">Future Roadmap</h3>
        <ul className="mt-4 space-y-2 text-will-light/80">
          <li className="flex gap-3">
            <span className="shrink-0 text-will-purple">◊</span>
            <span>Multi-asset support (beyond USDC)</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 text-will-purple">◊</span>
            <span>Guardian delegation and notification systems</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 text-will-purple">◊</span>
            <span>Advanced inheritance triggers and conditions</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 text-will-purple">◊</span>
            <span>Cross-chain interoperability</span>
          </li>
        </ul>
      </section>

      <Footer />
    </div>
  );
}

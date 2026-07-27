import { SoroWillClient, type SoroWillNetwork, type Will } from '@sorowill/sdk';

function readEnv(name: string, fallback?: string): string {
  const value = process.env[name];
  if (!value) {
    if (fallback !== undefined) return fallback;
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

let cachedClient: SoroWillClient | undefined;
let cachedNetwork: SoroWillNetwork | undefined;

/** The Stellar network configured for this deployment. */
export function getNetwork(): SoroWillNetwork {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('sorowill_network');
    if (stored === 'testnet' || stored === 'mainnet') {
      return stored as SoroWillNetwork;
    }
  }
  return readEnv('NEXT_PUBLIC_STELLAR_NETWORK', 'testnet') as SoroWillNetwork;
}

/** The deployed SoroWill contract address configured for this deployment. */
export function getContractId(): string {
  const network = getNetwork();
  if (network === 'mainnet') {
    return process.env.NEXT_PUBLIC_CONTRACT_ID_MAINNET || process.env.NEXT_PUBLIC_CONTRACT_ID || '';
  }
  return process.env.NEXT_PUBLIC_CONTRACT_ID_TESTNET || process.env.NEXT_PUBLIC_CONTRACT_ID || '';
}

/** The Soroban RPC URL configured for this deployment, for display/linking purposes. */
export function getRpcUrl(): string {
  const network = getNetwork();
  if (network === 'mainnet') {
    return process.env.NEXT_PUBLIC_RPC_URL_MAINNET || 'https://soroban-mainnet.stellar.org';
  }
  return process.env.NEXT_PUBLIC_RPC_URL_TESTNET || process.env.NEXT_PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org';
}

/**
 * Returns a lazily-initialized, module-level singleton `SoroWillClient`
 * configured from the active network.
 */
export function getSoroWillClient(): SoroWillClient {
  const network = getNetwork();
  const contractId = getContractId();
  if (!cachedClient || cachedNetwork !== network) {
    cachedClient = new SoroWillClient({ network, contractId });
    cachedNetwork = network;
  }
  return cachedClient;
}

/** Base URL for viewing addresses/contracts/transactions on Stellar Expert. */
export function stellarExpertUrl(kind: 'contract' | 'account' | 'tx', id: string): string {
  const network = getNetwork();
  return `https://stellar.expert/explorer/${network}/${kind}/${id}`;
}

/** Fetches wills by guardian by scanning sequential will IDs. */
export async function getWillsByGuardian(guardianAddress: string): Promise<Will[]> {
  const client = getSoroWillClient();
  const wills: Will[] = [];
  const promises = [];
  // Scan sequentially up to 30 wills, which covers the test environment range.
  for (let i = 1; i <= 30; i++) {
    promises.push(
      client
        .getWill(i.toString())
        .then((will) => {
          if (will && will.guardians && will.guardians.includes(guardianAddress)) {
            wills.push(will);
          }
        })
        .catch(() => {
          // Ignore errors (will does not exist or network error)
        })
    );
  }
  await Promise.all(promises);
  return wills;
}



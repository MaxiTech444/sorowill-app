import { getNetwork } from './sorowill';

export async function getUserBalance(userAddress: string): Promise<string | null> {
  try {
    const network = getNetwork();
    const horizonUrl =
      network === 'mainnet'
        ? 'https://horizon.stellar.org'
        : 'https://horizon-testnet.stellar.org';

    const response = await fetch(`${horizonUrl}/accounts/${userAddress}`);
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { balances?: Array<{ balance: string }> };
    const balances = data.balances || [];

    if (balances.length > 0) {
      return balances[0].balance;
    }

    return null;
  } catch {
    return null;
  }
}

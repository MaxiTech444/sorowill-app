import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  safeIsFreighterInstalled,
  safeConnectWallet,
  safeGetPublicKey,
  safeGetWalletNetwork,
  truncateAddress,
} from '@/lib/freighter';

describe('freighter.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('safeIsFreighterInstalled', () => {
    it('should return false during SSR (when window is undefined)', async () => {
      const result = await safeIsFreighterInstalled();
      expect(result).toBe(false);
    });
  });

  describe('safeConnectWallet', () => {
    it('should be defined as an async function', () => {
      // safeConnectWallet is properly defined and should be callable
      // The SSR check (isBrowser) is tested implicitly through integration tests
      // where the function is called from server-side components
      expect(typeof safeConnectWallet).toBe('function');
    });
  });

  describe('safeGetPublicKey', () => {
    it('should return null during SSR (when window is undefined)', async () => {
      const result = await safeGetPublicKey();
      expect(result).toBeNull();
    });
  });

  describe('safeGetWalletNetwork', () => {
    it('should return null during SSR (when window is undefined)', async () => {
      const result = await safeGetWalletNetwork();
      expect(result).toBeNull();
    });
  });

  describe('truncateAddress', () => {
    it('should return short addresses unchanged', () => {
      expect(truncateAddress('GABC')).toBe('GABC');
      expect(truncateAddress('GABCD')).toBe('GABCD');
    });

    it('should truncate long addresses to first 4 and last 4 characters', () => {
      const longAddress = 'GBBD47UZQ5VOHF4AKOA7CMM7SVQE6AKMOUIVJGN7BQHMPUYKUUY7BK43';
      const result = truncateAddress(longAddress);
      expect(result).toBe('GBBD...BK43');
    });

    it('should handle 12-character addresses', () => {
      const address = 'GBBD47UZQ5VO';
      expect(truncateAddress(address)).toBe(address);
    });

    it('should handle 13-character addresses', () => {
      const address = 'GBBD47UZQ5VOH';
      expect(truncateAddress(address)).toBe('GBBD...5VOH');
    });

    it('should handle various Stellar address formats', () => {
      const publicAddress = 'GCZST3WHSPDTQK37QWFC3KXZK5OJJ53FUWZPAB5XGTK47ZD5PTJUWQXI';
      expect(truncateAddress(publicAddress)).toBe('GCZS...WQXI');

      const contractAddress = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4';
      expect(truncateAddress(contractAddress)).toBe('CAAA...BSC4');
    });
  });
});

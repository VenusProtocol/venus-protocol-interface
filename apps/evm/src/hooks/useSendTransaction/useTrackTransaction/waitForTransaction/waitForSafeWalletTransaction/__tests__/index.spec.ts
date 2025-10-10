import { ChainId, chains } from '@venusprotocol/chains';
import { VError } from 'libs/errors';
import type { Hex } from 'viem';
import { type Mock, vi } from 'vitest';

import { WAIT_INTERVAL_MS, waitForSafeWalletTransaction } from '..';
import { getSafeWalletTransaction } from '../getSafeWalletTransaction';

vi.mock('../getSafeWalletTransaction', () => ({
  getSafeWalletTransaction: vi.fn(),
}));

const fakeTransactionHash: Hex = '0x123';
const fakeTimeoutMs = 5000;
const originalSafeWalletApiUrl = chains[ChainId.BSC_TESTNET].safeWalletApiUrl;

describe('waitForSafeWalletTransaction', () => {
  beforeEach(() => {
    chains[ChainId.BSC_TESTNET].safeWalletApiUrl = 'https://fake-safe-wallet-api-url.com';
    vi.useFakeTimers();
  });

  afterEach(() => {
    chains[ChainId.BSC_TESTNET].safeWalletApiUrl = originalSafeWalletApiUrl;
    vi.useRealTimers();
  });

  it('returns transaction hash when Safe Wallet transaction is found and confirmed', async () => {
    (getSafeWalletTransaction as Mock).mockImplementation(async () => ({
      safeWalletTransaction: {
        transactionHash: fakeTransactionHash,
        isSuccessful: true,
        confirmationsRequired: 1,
        confirmations: [{}],
      },
    }));

    const promise = waitForSafeWalletTransaction({
      chainId: ChainId.BSC_TESTNET,
      hash: '0x456',
      timeoutMs: fakeTimeoutMs,
    });

    const result = await promise;
    expect(result).toEqual({ transactionHash: fakeTransactionHash });
  });

  it('returns undefined transaction hash when timeout is reached', async () => {
    (getSafeWalletTransaction as Mock).mockImplementation(async () => ({
      safeWalletTransaction: {
        transactionHash: null,
        isSuccessful: null,
        confirmationsRequired: 1,
        confirmations: [],
      },
    }));

    const promise = waitForSafeWalletTransaction({
      chainId: ChainId.BSC_TESTNET,
      hash: '0x456',
      timeoutMs: fakeTimeoutMs,
    });

    // Fast-forward past the timeout
    await vi.advanceTimersByTimeAsync(fakeTimeoutMs + 100);

    const result = await promise;
    expect(result).toEqual({ transactionHash: undefined });
    // Check getSafeWalletTransaction was called at each interval
    expect(getSafeWalletTransaction).toHaveBeenCalledTimes(fakeTimeoutMs / WAIT_INTERVAL_MS);
  });

  it('handles undefined safeWalletTransaction response', async () => {
    (getSafeWalletTransaction as Mock).mockImplementation(async () => ({
      safeWalletTransaction: undefined,
    }));

    const promise = waitForSafeWalletTransaction({
      chainId: ChainId.BSC_TESTNET,
      hash: '0x456',
      timeoutMs: fakeTimeoutMs,
    });

    await vi.advanceTimersByTimeAsync(fakeTimeoutMs + 100);

    const result = await promise;
    expect(result).toEqual({ transactionHash: undefined });
  });

  it('continues polling until transaction hash is found', async () => {
    const fakeSafeTransaction = {
      transactionHash: null,
      isSuccessful: null,
      confirmationsRequired: 1,
      confirmations: [],
    };

    (getSafeWalletTransaction as Mock)
      // First call returns no transaction hash
      .mockImplementationOnce(async () => ({
        safeWalletTransaction: fakeSafeTransaction,
      }))
      // Second call returns the transaction hash
      .mockImplementationOnce(async () => ({
        safeWalletTransaction: {
          ...fakeSafeTransaction,
          transactionHash: fakeTransactionHash,
        },
      }));

    const promise = waitForSafeWalletTransaction({
      chainId: ChainId.BSC_TESTNET,
      hash: '0x456',
      timeoutMs: fakeTimeoutMs,
    });

    // Fast-forward past second interval
    await vi.advanceTimersByTimeAsync(WAIT_INTERVAL_MS * 2 + 100);

    const result = await promise;
    expect(result).toEqual({ transactionHash: fakeTransactionHash });
    expect(getSafeWalletTransaction).toHaveBeenCalledTimes(2);
  });

  it('handles missing Safe Wallet API URL error', async () => {
    chains[ChainId.BSC_TESTNET].safeWalletApiUrl = undefined;

    (getSafeWalletTransaction as Mock).mockImplementation(async () => {
      throw new VError({
        type: 'unexpected',
        code: 'missingSafeWalletApiUrl',
      });
    });

    await expect(
      waitForSafeWalletTransaction({
        chainId: ChainId.BSC_TESTNET,
        hash: '0x456',
        timeoutMs: fakeTimeoutMs,
      }),
    ).rejects.toThrow(VError);
  });
});

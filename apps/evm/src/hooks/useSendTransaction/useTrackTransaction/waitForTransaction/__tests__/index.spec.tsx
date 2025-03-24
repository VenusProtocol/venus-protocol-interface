import type { Mock } from 'vitest';

import { ChainId, chainMetadata } from '@venusprotocol/chains';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeProvider from '__mocks__/models/provider';
import type { Hex } from 'viem';

import { waitForTransaction } from '..';
import { waitForSafeWalletTransaction } from '../waitForSafeWalletTransaction';

vi.mock('../waitForSafeWalletTransaction', () => ({
  waitForSafeWalletTransaction: vi.fn(),
}));

const fakeTransactionHash: Hex = '0x123';
const fakeSafeTransactionHash: Hex = '0x456';
const fakeTimeoutMs = 5000;
const fakeConfirmations = 1;

const originalSafeWalletApiUrl = chainMetadata[ChainId.BSC_TESTNET].safeWalletApiUrl;

describe('waitForTransaction', () => {
  beforeEach(() => {
    chainMetadata[ChainId.BSC_TESTNET].safeWalletApiUrl = 'https://fake-safe-wallet-api-url.com';

    vi.useFakeTimers();
  });

  afterEach(() => {
    chainMetadata[ChainId.BSC_TESTNET].safeWalletApiUrl = originalSafeWalletApiUrl;

    vi.useRealTimers();
  });

  it('handles regular transaction successfully', async () => {
    (fakeProvider.waitForTransaction as Mock).mockImplementation(async () => fakeContractReceipt);

    const result = await waitForTransaction({
      provider: fakeProvider,
      hash: fakeTransactionHash,
      confirmations: fakeConfirmations,
      isSafeWalletTransaction: false,
      timeoutMs: fakeTimeoutMs,
    });

    expect(result).toEqual({ transactionReceipt: fakeContractReceipt });
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledWith(
      fakeTransactionHash,
      fakeConfirmations,
      fakeTimeoutMs,
    );
    expect(waitForSafeWalletTransaction).not.toHaveBeenCalled();
  });

  it('handles Safe Wallet transaction successfully', async () => {
    (waitForSafeWalletTransaction as Mock).mockImplementation(async () => ({
      transactionHash: fakeTransactionHash,
    }));

    (fakeProvider.waitForTransaction as Mock).mockImplementation(async () => fakeContractReceipt);

    const result = await waitForTransaction({
      provider: fakeProvider,
      hash: fakeSafeTransactionHash,
      confirmations: fakeConfirmations,
      isSafeWalletTransaction: true,
      timeoutMs: fakeTimeoutMs,
    });

    expect(result).toEqual({ transactionReceipt: fakeContractReceipt });
    expect(waitForSafeWalletTransaction).toHaveBeenCalledWith({
      chainId: fakeProvider.network.chainId,
      hash: fakeSafeTransactionHash,
      timeoutMs: fakeTimeoutMs,
    });
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledWith(
      fakeTransactionHash,
      fakeConfirmations,
      fakeTimeoutMs,
    );
  });

  it('handles Safe Wallet transaction with no transaction hash', async () => {
    (waitForSafeWalletTransaction as Mock).mockImplementation(async () => ({
      transactionHash: undefined,
    }));

    const result = await waitForTransaction({
      provider: fakeProvider,
      hash: fakeSafeTransactionHash,
      confirmations: fakeConfirmations,
      isSafeWalletTransaction: true,
      timeoutMs: fakeTimeoutMs,
    });

    expect(result).toEqual({ transactionReceipt: undefined });
    expect(waitForSafeWalletTransaction).toHaveBeenCalledWith({
      chainId: fakeProvider.network.chainId,
      hash: fakeSafeTransactionHash,
      timeoutMs: fakeTimeoutMs,
    });
    expect(fakeProvider.waitForTransaction).not.toHaveBeenCalled();
  });

  it('handles Safe Wallet transaction error', async () => {
    const fakeError = new Error('Safe Wallet error');
    (waitForSafeWalletTransaction as Mock).mockRejectedValue(fakeError);

    await expect(
      waitForTransaction({
        provider: fakeProvider,
        hash: fakeSafeTransactionHash,
        confirmations: fakeConfirmations,
        isSafeWalletTransaction: true,
        timeoutMs: fakeTimeoutMs,
      }),
    ).rejects.toThrow(fakeError);
  });

  it('handles provider waitForTransaction error', async () => {
    const fakeError = new Error('Provider error');
    (fakeProvider.waitForTransaction as Mock).mockRejectedValue(fakeError);

    await expect(
      waitForTransaction({
        provider: fakeProvider,
        hash: fakeTransactionHash,
        confirmations: fakeConfirmations,
        isSafeWalletTransaction: false,
        timeoutMs: fakeTimeoutMs,
      }),
    ).rejects.toThrow(fakeError);
  });
});

import { ChainId, chainMetadata } from '@venusprotocol/chains';
import { VError } from 'libs/errors';
import type { Hex } from 'viem';
import { vi } from 'vitest';

import { getSafeWalletTransaction } from '..';

const fakeTransactionHash: Hex = '0x123';
const fakeSafeWalletApiUrl = 'https://fake-safe-wallet-api-url.com';
const expectedEndpoint = `${fakeSafeWalletApiUrl}/api/v2/multisig-transactions/${fakeTransactionHash}/`;
const originalSafeWalletApiUrl = chainMetadata[ChainId.BSC_TESTNET].safeWalletApiUrl;

describe('getSafeWalletTransaction', () => {
  beforeEach(() => {
    chainMetadata[ChainId.BSC_TESTNET].safeWalletApiUrl = fakeSafeWalletApiUrl;
    global.fetch = vi.fn();
  });

  afterEach(() => {
    chainMetadata[ChainId.BSC_TESTNET].safeWalletApiUrl = originalSafeWalletApiUrl;
    vi.restoreAllMocks();
  });

  it('returns Safe Wallet transaction when API call is successful', async () => {
    const fakeSafeWalletTransaction = {
      transactionHash: fakeTransactionHash,
      isSuccessful: true,
      confirmationsRequired: 1,
      confirmations: [{}],
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(fakeSafeWalletTransaction),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getSafeWalletTransaction({
      chainId: ChainId.BSC_TESTNET,
      hash: fakeTransactionHash,
    });

    expect(result).toEqual({
      safeWalletTransaction: fakeSafeWalletTransaction,
    });

    expect(global.fetch).toHaveBeenCalledWith(expectedEndpoint);
  });

  it('returns Safe Wallet transaction with null transaction hash when API call is successful', async () => {
    const fakeSafeWalletTransaction = {
      transactionHash: null,
      isSuccessful: null,
      confirmationsRequired: 1,
      confirmations: [],
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(fakeSafeWalletTransaction),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getSafeWalletTransaction({
      chainId: ChainId.BSC_TESTNET,
      hash: fakeTransactionHash,
    });

    expect(result).toEqual({
      safeWalletTransaction: fakeSafeWalletTransaction,
    });

    expect(global.fetch).toHaveBeenCalledWith(expectedEndpoint);
  });

  it('throws error when Safe Wallet API URL is missing', async () => {
    chainMetadata[ChainId.BSC_TESTNET].safeWalletApiUrl = undefined;

    await expect(
      getSafeWalletTransaction({
        chainId: ChainId.BSC_TESTNET,
        hash: fakeTransactionHash,
      }),
    ).rejects.toThrow(
      new VError({
        type: 'unexpected',
        code: 'missingSafeWalletApiUrl',
      }),
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('throws error when API response is not OK', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(
      getSafeWalletTransaction({
        chainId: ChainId.BSC_TESTNET,
        hash: fakeTransactionHash,
      }),
    ).rejects.toThrow(
      new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      }),
    );

    expect(global.fetch).toHaveBeenCalledWith(expectedEndpoint);
  });

  it('handles network error', async () => {
    const fakeNetworkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValue(fakeNetworkError);

    await expect(
      getSafeWalletTransaction({
        chainId: ChainId.BSC_TESTNET,
        hash: fakeTransactionHash,
      }),
    ).rejects.toThrow(fakeNetworkError);

    expect(global.fetch).toHaveBeenCalledWith(expectedEndpoint);
  });

  it('handles malformed JSON response', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(
      getSafeWalletTransaction({
        chainId: ChainId.BSC_TESTNET,
        hash: fakeTransactionHash,
      }),
    ).rejects.toThrow(
      new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      }),
    );

    expect(global.fetch).toHaveBeenCalledWith(expectedEndpoint);
  });
});

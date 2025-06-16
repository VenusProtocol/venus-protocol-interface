import type { Mock } from 'vitest';

import { ChainId, chainMetadata } from '@venusprotocol/chains';
import { transactionReceipt as fakeTransactionReceipt } from '__mocks__/models/transactionReceipt';
import type { Hex, PublicClient } from 'viem';

import { waitForTransaction } from '..';
import { waitForSafeWalletTransaction } from '../waitForSafeWalletTransaction';

vi.mock('../waitForSafeWalletTransaction', () => ({
  waitForSafeWalletTransaction: vi.fn(),
}));

const mockWaitForTransactionReceipt = vi.fn(() => fakeTransactionReceipt);
const mockWaitForSupertransactionReceipt = vi.fn();

const fakePublicClient = {
  waitForTransactionReceipt: mockWaitForTransactionReceipt,
} as unknown as PublicClient;

const fakeMeeClient = {
  waitForSupertransactionReceipt: mockWaitForSupertransactionReceipt,
} as unknown as any;

const fakeSafeTransactionHash: Hex = '0x456';

const fakeInput = {
  hash: '0x123',
  confirmations: 1,
  isRunningInSafeApp: false,
  timeoutMs: 5000,
  chainId: ChainId.BSC_TESTNET,
  publicClient: fakePublicClient,
  transactionType: 'chain',
} as const;

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
    const result = await waitForTransaction(fakeInput);

    expect(result).toEqual({ transactionReceipt: fakeTransactionReceipt });

    expect(
      (fakePublicClient.waitForTransactionReceipt as Mock).mock.calls[0],
    ).toMatchInlineSnapshot(`
      [
        {
          "confirmations": 1,
          "hash": "0x123",
          "timeout": 5000,
        },
      ]
    `);

    expect(waitForSafeWalletTransaction).not.toHaveBeenCalled();
  });

  it('handles Safe Wallet transaction successfully', async () => {
    (waitForSafeWalletTransaction as Mock).mockImplementation(async () => ({
      transactionHash: fakeInput.hash,
    }));

    const result = await waitForTransaction({
      ...fakeInput,
      isRunningInSafeApp: true,
      hash: fakeSafeTransactionHash,
    });

    expect(result).toEqual({ transactionReceipt: fakeTransactionReceipt });

    expect((waitForSafeWalletTransaction as Mock).mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "chainId": 97,
          "hash": "0x456",
          "timeoutMs": 5000,
        },
      ]
    `);

    expect(
      (fakePublicClient.waitForTransactionReceipt as Mock).mock.calls[0],
    ).toMatchInlineSnapshot(`
      [
        {
          "confirmations": 1,
          "hash": "0x123",
          "timeout": 5000,
        },
      ]
    `);
  });

  it('handles Safe Wallet transaction with no transaction hash', async () => {
    (waitForSafeWalletTransaction as Mock).mockImplementation(async () => ({
      transactionHash: undefined,
    }));

    const result = await waitForTransaction({
      ...fakeInput,
      isRunningInSafeApp: true,
      hash: fakeSafeTransactionHash,
    });

    expect(result).toEqual({ transactionReceipt: undefined });

    expect((waitForSafeWalletTransaction as Mock).mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "chainId": 97,
          "hash": "0x456",
          "timeoutMs": 5000,
        },
      ]
    `);

    expect(fakePublicClient.waitForTransactionReceipt).not.toHaveBeenCalled();
  });

  it('handles Safe Wallet transaction error', async () => {
    const fakeError = new Error('Safe Wallet error');
    (waitForSafeWalletTransaction as Mock).mockRejectedValue(fakeError);

    await expect(
      waitForTransaction({
        ...fakeInput,
        isRunningInSafeApp: true,
        hash: fakeSafeTransactionHash,
      }),
    ).rejects.toThrow(fakeError);
  });

  it('handles public client waitForTransaction error', async () => {
    const fakeError = new Error('Public client error');
    mockWaitForTransactionReceipt.mockRejectedValue(fakeError);

    await expect(waitForTransaction(fakeInput)).rejects.toThrow(fakeError);
  });

  it('handles biconomy transaction successfully', async () => {
    const fakeBiconomyReceipt = {
      transactionStatus: 'success',
      receipts: [fakeTransactionReceipt],
    };
    mockWaitForSupertransactionReceipt.mockResolvedValue(fakeBiconomyReceipt);

    const result = await waitForTransaction({
      ...fakeInput,
      transactionType: 'biconomy',
      meeClient: fakeMeeClient,
    });

    expect(result).toEqual({ transactionReceipt: fakeBiconomyReceipt });

    expect(mockWaitForSupertransactionReceipt).toHaveBeenCalledWith({
      hash: fakeInput.hash,
    });

    expect(fakePublicClient.waitForTransactionReceipt).not.toHaveBeenCalled();
    expect(waitForSafeWalletTransaction).not.toHaveBeenCalled();
  });

  it('throws error when meeClient is not provided for biconomy transaction', async () => {
    await expect(
      waitForTransaction({
        ...fakeInput,
        transactionType: 'biconomy',
      }),
    ).rejects.toThrow('somethingWentWrong');

    expect(mockWaitForSupertransactionReceipt).not.toHaveBeenCalled();
    expect(fakePublicClient.waitForTransactionReceipt).not.toHaveBeenCalled();
    expect(waitForSafeWalletTransaction).not.toHaveBeenCalled();
  });

  it('handles biconomy transaction error', async () => {
    const fakeError = new Error('Biconomy error');
    mockWaitForSupertransactionReceipt.mockRejectedValue(fakeError);

    await expect(
      waitForTransaction({
        ...fakeInput,
        transactionType: 'biconomy',
        meeClient: fakeMeeClient,
      }),
    ).rejects.toThrow(fakeError);

    expect(mockWaitForSupertransactionReceipt).toHaveBeenCalledWith({
      hash: fakeInput.hash,
    });

    expect(fakePublicClient.waitForTransactionReceipt).not.toHaveBeenCalled();
    expect(waitForSafeWalletTransaction).not.toHaveBeenCalled();
  });
});

import type { GetFusionQuotePayload, MeeClient } from '@biconomy/abstractjs';
import { ChainId } from '@venusprotocol/chains';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { txData } from '__mocks__/models/transactionData';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { VError } from 'libs/errors';
import { useMeeClient, usePublicClient } from 'libs/wallet';
import noop from 'noop-ts';
import { renderHook } from 'testUtils/render';
import type { PublicClient, WalletClient } from 'viem';
import type { Mock } from 'vitest';
import type { useSendTransaction as UseSendTransaction } from '..';
import { sendTransaction } from '../sendTransaction';
import { useTrackTransaction } from '../useTrackTransaction';

const { useSendTransaction }: { useSendTransaction: typeof UseSendTransaction } =
  await vi.importActual('hooks/useSendTransaction');

vi.mock('../useTrackTransaction');
vi.mock('../sendTransaction');

const mockWalletClient = {} as unknown as WalletClient;
const mockPublicClient = {} as unknown as PublicClient;
const mockMeeClient = {} as unknown as MeeClient;

vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');

  return {
    ...actual,
    useWalletClient: vi.fn(() => ({
      data: mockWalletClient,
    })),
  };
});

const fakeHookInput = {
  fn: vi.fn(async () => txData),
  onConfirmed: noop,
  onReverted: noop,
};
const fakeMutationInput = {};

describe('useSendTransaction', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);

    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: mockPublicClient,
    }));

    (useMeeClient as Mock).mockImplementation(() => ({
      data: { meeClient: mockMeeClient },
    }));
  });

  it('sends transaction and tracks it', async () => {
    const trackTransactionMockCallback = vi.fn();
    const trackTransactionMock = vi.fn(async () => {
      await new Promise(
        resolve =>
          setTimeout(() => {
            trackTransactionMockCallback();
            resolve(undefined);
          }, 100), // Add delay
      );
    });
    (useTrackTransaction as Mock).mockImplementation(() => trackTransactionMock);
    (sendTransaction as Mock).mockReturnValue({ transactionHash: fakeContractTransaction.hash });

    const onSuccessMock = vi.fn();

    const { result } = renderHook(
      () =>
        useSendTransaction({
          ...fakeHookInput,
          options: {
            onSuccess: onSuccessMock,
          },
        }),
      {
        accountAddress: fakeAccountAddress,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const { mutateAsync } = result.current;

    // Send transaction
    await mutateAsync(fakeMutationInput);

    expect(fakeHookInput.fn).toHaveBeenCalledTimes(1);
    expect(fakeHookInput.fn).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendTransaction).toHaveBeenCalledWith({
      txData,
      gasless: false,
      publicClient: mockPublicClient,
      walletClient: mockWalletClient,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect(trackTransactionMock).toHaveBeenCalledTimes(1);
    expect(trackTransactionMock).toHaveBeenCalledWith({
      transactionHash: fakeContractTransaction.hash,
      onConfirmed: expect.any(Function),
      onReverted: expect.any(Function),
    });

    // Check trackTransaction was not awaited before onSuccess was called
    expect(trackTransactionMockCallback).not.toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
  });

  it('sends transaction, tracks it and waits for its confirmation before returning', async () => {
    const trackTransactionMockCallback = vi.fn();
    const trackTransactionMock = vi.fn(async () => {
      await new Promise(
        resolve =>
          setTimeout(() => {
            trackTransactionMockCallback();
            resolve(undefined);
          }, 100), // Add delay
      );
    });
    (useTrackTransaction as Mock).mockImplementation(() => trackTransactionMock);

    (sendTransaction as Mock).mockReturnValue({ transactionHash: fakeContractTransaction.hash });

    const onSuccessMock = vi.fn();

    const { result } = renderHook(
      () =>
        useSendTransaction({
          ...fakeHookInput,
          options: {
            onSuccess: onSuccessMock,
            waitForConfirmation: true,
          },
        }),
      {
        accountAddress: fakeAccountAddress,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const { mutateAsync } = result.current;

    // Send transaction
    await mutateAsync(fakeMutationInput);

    expect(fakeHookInput.fn).toHaveBeenCalledTimes(1);
    expect(fakeHookInput.fn).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendTransaction).toHaveBeenCalledWith({
      txData,
      gasless: false,
      publicClient: mockPublicClient,
      walletClient: mockWalletClient,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    // Verify that onSuccess was called after the trackTransaction promise resolved
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onSuccessMock).toHaveBeenCalledWith(undefined, fakeMutationInput, undefined);

    expect(trackTransactionMock).toHaveBeenCalledTimes(1);
    expect(trackTransactionMock).toHaveBeenCalledWith({
      transactionHash: fakeContractTransaction.hash,
      onConfirmed: expect.any(Function),
      onReverted: expect.any(Function),
    });

    // Check trackTransaction was awaited before onSuccess was called
    expect(trackTransactionMockCallback).toHaveBeenCalledTimes(1);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
  });

  it('calls onError callback when transaction fails', async () => {
    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Mock).mockImplementation(() => trackTransactionMock);

    const error = new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
    (sendTransaction as Mock).mockRejectedValue(error);

    const onErrorMock = vi.fn();

    const { result } = renderHook(
      () =>
        useSendTransaction({
          ...fakeHookInput,
          options: {
            onError: onErrorMock,
          },
        }),
      {
        accountAddress: fakeAccountAddress,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const { mutateAsync } = result.current;

    // Send transaction
    await expect(mutateAsync(fakeMutationInput)).rejects.toThrow(error.code);

    expect(fakeHookInput.fn).toHaveBeenCalledTimes(1);
    expect(fakeHookInput.fn).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendTransaction).toHaveBeenCalledWith({
      txData,
      gasless: false,
      publicClient: mockPublicClient,
      walletClient: mockWalletClient,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect(trackTransactionMock).not.toHaveBeenCalled();

    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledWith(error, fakeMutationInput, undefined);
  });

  it('sends Biconomy transaction correctly', async () => {
    (sendTransaction as Mock).mockReturnValue({ transactionHash: fakeContractTransaction.hash });
    (useTrackTransaction as Mock).mockImplementation(() => vi.fn());

    const customTxData = {
      quote: {},
    } as unknown as GetFusionQuotePayload;

    const { result } = renderHook(
      () =>
        useSendTransaction({
          ...fakeHookInput,
          fn: vi.fn(async () => customTxData),
          transactionType: 'biconomy',
        }),
      {
        accountAddress: fakeAccountAddress,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const { mutateAsync } = result.current;

    // Send transaction
    await mutateAsync(fakeMutationInput);

    expect(sendTransaction).toHaveBeenCalledWith({
      txData: customTxData,
      meeClient: mockMeeClient,
    });
  });

  it('throws an error when sending Biconomy transaction with no MEE client available', async () => {
    (useMeeClient as Mock).mockImplementation(() => ({
      data: { meeClient: undefined },
    }));

    const customTxData = {
      quote: {},
    } as unknown as GetFusionQuotePayload;

    const { result } = renderHook(
      () =>
        useSendTransaction({
          ...fakeHookInput,
          fn: vi.fn(async () => customTxData),
          transactionType: 'biconomy',
        }),
      {
        accountAddress: fakeAccountAddress,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const { mutateAsync } = result.current;

    // Send transaction
    await expect(async () => mutateAsync(fakeMutationInput)).rejects.toThrow('somethingWentWrong');
  });
});

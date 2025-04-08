import { ChainId } from '@venusprotocol/chains';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import contractTxData from '__mocks__/models/contractTxData';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { VError } from 'libs/errors';
import noop from 'noop-ts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import type { Config as WagmiConfig } from 'wagmi';
import { useSendTransaction } from '..';
import { sendTransaction } from '../sendTransaction';
import { useTrackTransaction } from '../useTrackTransaction';

vi.mock('../useTrackTransaction');
vi.mock('../sendTransaction');

const mockWagmiConfig = {} as WagmiConfig;

vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');

  return {
    ...actual,
    useConfig: vi.fn(() => mockWagmiConfig),
  };
});

const fakeHookInput = {
  fn: vi.fn(async () => contractTxData),
  onConfirmed: noop,
  onReverted: noop,
};
const fakeMutationInput = {};

describe('useSendTransaction', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);
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
      txData: contractTxData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
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
      txData: contractTxData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
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
      txData: contractTxData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
      chainId: ChainId.BSC_TESTNET,
      accountAddress: fakeAccountAddress,
    });

    expect(trackTransactionMock).not.toHaveBeenCalled();

    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledWith(error, fakeMutationInput, undefined);
  });
});

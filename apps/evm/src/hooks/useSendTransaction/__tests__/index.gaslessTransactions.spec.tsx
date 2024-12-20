import noop from 'noop-ts';
import type Vi from 'vitest';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import contractTxData from '__mocks__/models/contractTxData';
import { useGetPaymasterInfo } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { store } from 'containers/ResendPayingGasModal/store';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { VError } from 'libs/errors';
import { useSendContractTransaction } from 'libs/wallet';
import { initialUserSettings } from 'store';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import { useSendTransaction } from '..';
import { useTrackTransaction } from '../useTrackTransaction';

vi.mock('../useTrackTransaction');
vi.mock('hooks/useUserChainSettings', () => ({
  useUserChainSettings: vi.fn(() => [initialUserSettings[ChainId.ZKSYNC_SEPOLIA], vi.fn()]),
}));
vi.mock('containers/ResendPayingGasModal/store', () => ({
  store: {
    use: { openModal: vi.fn() },
  },
}));

const fakeFnKey = [FunctionKey.SUPPLY];
const fakeHookInput = {
  fn: vi.fn(async () => contractTxData),
  fnKey: fakeFnKey,
  onConfirmed: noop,
  onReverted: noop,
};
const fakeMutationInput = {};

describe('useSendTransaction - Feature enabled: gaslessTransactions', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'gaslessTransactions',
    );

    (useGetPaymasterInfo as Vi.Mock).mockReturnValue({
      data: { canSponsorTransactions: true },
      refetch: vi.fn(),
    });
  });

  it('sends gasless transaction when conditions are met', async () => {
    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Vi.Mock).mockImplementation(() => trackTransactionMock);

    const sendContractTransactionMock = vi.fn(async () => fakeContractTransaction);
    (useSendContractTransaction as Vi.Mock).mockReturnValue({
      mutateAsync: sendContractTransactionMock,
    });

    const fnMock = vi.fn(async () => contractTxData);

    const { result } = renderHook(() => useSendTransaction({ ...fakeHookInput, fn: fnMock }));

    const { mutateAsync } = result.current;
    await mutateAsync(fakeMutationInput);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendContractTransactionMock).toHaveBeenCalledWith({
      txData: contractTxData,
      gasless: true,
    });

    expect(trackTransactionMock).toHaveBeenCalledTimes(1);
    expect(trackTransactionMock).toHaveBeenCalledWith({
      transactionHash: fakeContractTransaction.hash,
      onConfirmed: expect.any(Function),
      onReverted: expect.any(Function),
    });
  });

  it('handles gasless transaction error and opens ResendPayingGasModal', async () => {
    const refetchMock = vi.fn();
    (useGetPaymasterInfo as Vi.Mock).mockReturnValue({
      data: { canSponsorTransactions: true },
      refetch: refetchMock,
    });

    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Vi.Mock).mockImplementation(() => trackTransactionMock);

    const errorCode = 'gaslessTransactionNotAvailable';

    const sendContractTransactionMock = vi.fn().mockRejectedValue(
      new VError({
        type: 'unexpected',
        code: errorCode,
      }),
    );
    (useSendContractTransaction as Vi.Mock).mockReturnValue({
      mutateAsync: sendContractTransactionMock,
    });

    const openModalMock = vi.fn();
    (store.use.openModal as Vi.Mock).mockImplementation(() => openModalMock);

    const fnMock = vi.fn(async () => contractTxData);

    const customFakeHookInput = {
      ...fakeHookInput,
      fn: fnMock,
      options: {
        tryGasless: true,
      },
    };

    const { result } = renderHook(() => useSendTransaction(customFakeHookInput));

    const { mutateAsync } = result.current;
    await expect(mutateAsync(fakeMutationInput)).rejects.toThrow(errorCode);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendContractTransactionMock).toHaveBeenCalledWith({
      txData: contractTxData,
      gasless: true,
    });

    expect(trackTransactionMock).not.toHaveBeenCalled();

    expect(refetchMock).toHaveBeenCalledTimes(1);

    expect(openModalMock).toHaveBeenCalledTimes(1);
    expect(openModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        lastFailedGaslessTransaction: {
          ...customFakeHookInput,
          mutationInput: fakeMutationInput,
        },
      }),
    );
  });

  it('falls back to regular transaction when paymaster can not sponsor them', async () => {
    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Vi.Mock).mockImplementation(() => trackTransactionMock);

    (useGetPaymasterInfo as Vi.Mock).mockReturnValue({
      data: { canSponsorTransactions: false },
      refetch: vi.fn(),
    });

    const sendContractTransactionMock = vi.fn(() => fakeContractTransaction);
    (useSendContractTransaction as Vi.Mock).mockReturnValue({
      mutateAsync: sendContractTransactionMock,
    });

    const fnMock = vi.fn(async () => contractTxData);

    const { result } = renderHook(() => useSendTransaction({ ...fakeHookInput, fn: fnMock }));

    const { mutateAsync } = result.current;
    await mutateAsync(fakeMutationInput);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendContractTransactionMock).toHaveBeenCalledWith({
      txData: contractTxData,
      gasless: false,
    });

    expect(trackTransactionMock).toHaveBeenCalledTimes(1);
    expect(trackTransactionMock).toHaveBeenCalledWith({
      transactionHash: fakeContractTransaction.hash,
      onConfirmed: expect.any(Function),
      onReverted: expect.any(Function),
    });
  });

  it('falls back to regular transaction when tryGasless option is false', async () => {
    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Vi.Mock).mockImplementation(() => trackTransactionMock);

    const sendContractTransactionMock = vi.fn(() => fakeContractTransaction);
    (useSendContractTransaction as Vi.Mock).mockReturnValue({
      mutateAsync: sendContractTransactionMock,
    });

    const fnMock = vi.fn(async () => contractTxData);

    const { result } = renderHook(() =>
      useSendTransaction({ ...fakeHookInput, fn: fnMock, options: { tryGasless: false } }),
    );
    const { mutateAsync } = result.current;
    await mutateAsync(fakeMutationInput);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendContractTransactionMock).toHaveBeenCalledWith({
      txData: contractTxData,
      gasless: false,
    });

    expect(trackTransactionMock).toHaveBeenCalledTimes(1);
    expect(trackTransactionMock).toHaveBeenCalledWith({
      transactionHash: fakeContractTransaction.hash,
      onConfirmed: expect.any(Function),
      onReverted: expect.any(Function),
    });
  });

  it('falls back to regular transaction when gasless user setting is disabled', async () => {
    (useUserChainSettings as Vi.Mock).mockReturnValue([{ gaslessTransactions: false }, vi.fn()]);

    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Vi.Mock).mockImplementation(() => trackTransactionMock);

    const sendContractTransactionMock = vi.fn(() => fakeContractTransaction);
    (useSendContractTransaction as Vi.Mock).mockReturnValue({
      mutateAsync: sendContractTransactionMock,
    });

    const fnMock = vi.fn(async () => contractTxData);

    const { result } = renderHook(() => useSendTransaction({ ...fakeHookInput, fn: fnMock }));
    const { mutateAsync } = result.current;
    await mutateAsync(fakeMutationInput);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendContractTransactionMock).toHaveBeenCalledWith({
      txData: contractTxData,
      gasless: false,
    });

    expect(trackTransactionMock).toHaveBeenCalledTimes(1);
    expect(trackTransactionMock).toHaveBeenCalledWith({
      transactionHash: fakeContractTransaction.hash,
      onConfirmed: expect.any(Function),
      onReverted: expect.any(Function),
    });
  });
});

import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import contractTxData from '__mocks__/models/contractTxData';
import { useGetPaymasterInfo } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { store } from 'containers/ResendPayingGasModal/store';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { VError } from 'libs/errors';
import { initialUserSettings } from 'store';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
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
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'gaslessTransactions',
    );

    (useGetPaymasterInfo as Mock).mockReturnValue({
      data: { canSponsorTransactions: true },
      refetch: vi.fn(),
    });
  });

  it('sends gasless transaction when conditions are met', async () => {
    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Mock).mockImplementation(() => trackTransactionMock);

    (sendTransaction as Mock).mockReturnValue({ transactionHash: fakeContractTransaction.hash });

    const fnMock = vi.fn(async () => contractTxData);

    const { result } = renderHook(() => useSendTransaction({ ...fakeHookInput, fn: fnMock }));

    const { mutateAsync } = result.current;
    await mutateAsync(fakeMutationInput);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendTransaction).toHaveBeenCalledWith({
      txData: contractTxData,
      gasless: true,
      wagmiConfig: mockWagmiConfig,
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
    (useGetPaymasterInfo as Mock).mockReturnValue({
      data: { canSponsorTransactions: true },
      refetch: refetchMock,
    });

    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Mock).mockImplementation(() => trackTransactionMock);

    const errorCode = 'gaslessTransactionNotAvailable';

    (sendTransaction as Mock).mockRejectedValue(
      new VError({
        type: 'unexpected',
        code: errorCode,
      }),
    );

    const openModalMock = vi.fn();
    (store.use.openModal as Mock).mockImplementation(() => openModalMock);

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

    expect(sendTransaction).toHaveBeenCalledWith({
      txData: contractTxData,
      gasless: true,
      wagmiConfig: mockWagmiConfig,
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
    (useTrackTransaction as Mock).mockImplementation(() => trackTransactionMock);

    (useGetPaymasterInfo as Mock).mockReturnValue({
      data: { canSponsorTransactions: false },
      refetch: vi.fn(),
    });

    (sendTransaction as Mock).mockReturnValue({ transactionHash: fakeContractTransaction.hash });

    const fnMock = vi.fn(async () => contractTxData);

    const { result } = renderHook(() => useSendTransaction({ ...fakeHookInput, fn: fnMock }));

    const { mutateAsync } = result.current;
    await mutateAsync(fakeMutationInput);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendTransaction).toHaveBeenCalledWith({
      txData: contractTxData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
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
    (useTrackTransaction as Mock).mockImplementation(() => trackTransactionMock);

    (sendTransaction as Mock).mockReturnValue({ transactionHash: fakeContractTransaction.hash });

    const fnMock = vi.fn(async () => contractTxData);

    const { result } = renderHook(() =>
      useSendTransaction({ ...fakeHookInput, fn: fnMock, options: { tryGasless: false } }),
    );
    const { mutateAsync } = result.current;
    await mutateAsync(fakeMutationInput);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendTransaction).toHaveBeenCalledWith({
      txData: contractTxData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
    });

    expect(trackTransactionMock).toHaveBeenCalledTimes(1);
    expect(trackTransactionMock).toHaveBeenCalledWith({
      transactionHash: fakeContractTransaction.hash,
      onConfirmed: expect.any(Function),
      onReverted: expect.any(Function),
    });
  });

  it('falls back to regular transaction when gasless user setting is disabled', async () => {
    (useUserChainSettings as Mock).mockReturnValue([{ gaslessTransactions: false }, vi.fn()]);

    const trackTransactionMock = vi.fn();
    (useTrackTransaction as Mock).mockImplementation(() => trackTransactionMock);

    (sendTransaction as Mock).mockReturnValue({ transactionHash: fakeContractTransaction.hash });

    const fnMock = vi.fn(async () => contractTxData);

    const { result } = renderHook(() => useSendTransaction({ ...fakeHookInput, fn: fnMock }));
    const { mutateAsync } = result.current;
    await mutateAsync(fakeMutationInput);

    expect(fnMock).toHaveBeenCalledTimes(1);
    expect(fnMock).toHaveBeenCalledWith(fakeMutationInput);

    expect(sendTransaction).toHaveBeenCalledWith({
      txData: contractTxData,
      gasless: false,
      wagmiConfig: mockWagmiConfig,
    });

    expect(trackTransactionMock).toHaveBeenCalledTimes(1);
    expect(trackTransactionMock).toHaveBeenCalledWith({
      transactionHash: fakeContractTransaction.hash,
      onConfirmed: expect.any(Function),
      onReverted: expect.any(Function),
    });
  });
});

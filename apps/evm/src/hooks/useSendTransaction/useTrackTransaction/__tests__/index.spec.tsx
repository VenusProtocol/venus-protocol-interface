import type { Mock } from 'vitest';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { transactionReceipt as fakeTransactionReceipt } from '__mocks__/models/transactionReceipt';
import { ChainExplorerLink } from 'containers/ChainExplorerLink';
import {
  checkForComptrollerTransactionError,
  checkForTokenTransactionError,
  checkForVaiControllerTransactionError,
  checkForVaiVaultTransactionError,
  checkForXvsVaultProxyTransactionError,
} from 'libs/errors';
import { displayNotification, updateNotification } from 'libs/notifications';
import { en } from 'libs/translations';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import { waitForTransaction } from '../waitForTransaction';

import { CONFIRMATIONS } from 'hooks/useSendTransaction/constants';
import { useTrackTransaction } from '..';

vi.mock('context/ErrorLogger');
vi.mock('libs/notifications');
vi.mock('libs/errors');
vi.mock('errors');
vi.mock('viem', () => ({
  default: ({ content: _content, ...otherProps }: any) => <p {...otherProps}>content</p>,
}));

vi.mock('../waitForTransaction', () => ({
  waitForTransaction: vi.fn(() => ({
    transactionReceipt: fakeTransactionReceipt,
  })),
}));

const fakeError = new Error('Fake error');

describe('useTrackTransaction', () => {
  beforeEach(() => {
    (displayNotification as Mock).mockImplementation(({ id }: { id: string | number }) => id);
  });

  it('handles errors from waitForTransaction', async () => {
    (waitForTransaction as Mock).mockRejectedValue(new Error('Fake error'));

    const { result } = renderHook(() => useTrackTransaction());
    const trackTransaction = result.current;

    await trackTransaction({
      transactionHash: fakeContractTransaction.hash,
    });

    // Check loading notification was displayed
    expect(displayNotification).toHaveBeenCalledTimes(1);
    expect(displayNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'loading',
      autoClose: false,
      title: en.transactionNotification.pending.title,
      description: (
        <ChainExplorerLink
          chainId={ChainId.BSC_TESTNET}
          hash={fakeContractTransaction.hash}
          urlType="tx"
        />
      ),
    });

    // Check transaction was awaited
    expect(waitForTransaction).toHaveBeenCalledTimes(1);
    expect(waitForTransaction).toHaveBeenCalledWith({
      chainId: ChainId.BSC_TESTNET,
      confirmations: CONFIRMATIONS,
      hash: fakeContractTransaction.hash,
      isRunningInSafeApp: false,
      publicClient: undefined,
      timeoutMs: 180000,
      meeClient: undefined,
      transactionType: 'chain',
    });

    // Check notification was updated
    expect(updateNotification).toHaveBeenCalledTimes(1);
    expect(updateNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'warning',
      title: en.transactionNotification.couldNotFetchReceipt.title,
    });
  });

  it.each([
    { name: 'checkForComptrollerTransactionError', checkFn: checkForComptrollerTransactionError },
    { name: 'checkForComptrollerTransactionError', checkFn: checkForComptrollerTransactionError },
    { name: 'checkForTokenTransactionError', checkFn: checkForTokenTransactionError },
    {
      name: 'checkForVaiControllerTransactionError',
      checkFn: checkForVaiControllerTransactionError,
    },
    { name: 'checkForVaiVaultTransactionError', checkFn: checkForVaiVaultTransactionError },
    {
      name: 'checkForXvsVaultProxyTransactionError',
      checkFn: checkForXvsVaultProxyTransactionError,
    },
  ])(
    'checks for errors in transaction receipt on confirmation. Check function: %s',
    async ({ checkFn }) => {
      (checkFn as Mock).mockImplementation(() => {
        throw fakeError;
      });

      const { result } = renderHook(() => useTrackTransaction());
      const trackTransaction = result.current;

      await trackTransaction({
        transactionHash: fakeContractTransaction.hash,
      });

      // Check loading notification was displayed
      expect(displayNotification).toHaveBeenCalledTimes(1);
      expect(displayNotification).toHaveBeenCalledWith({
        id: fakeContractTransaction.hash,
        variant: 'loading',
        autoClose: false,
        title: en.transactionNotification.pending.title,
        description: (
          <ChainExplorerLink
            chainId={ChainId.BSC_TESTNET}
            hash={fakeContractTransaction.hash}
            urlType="tx"
          />
        ),
      });

      // Check transaction was awaited
      expect(waitForTransaction).toHaveBeenCalledTimes(1);
      expect(waitForTransaction).toHaveBeenCalledWith({
        chainId: ChainId.BSC_TESTNET,
        confirmations: CONFIRMATIONS,
        hash: fakeContractTransaction.hash,
        isRunningInSafeApp: false,
        publicClient: undefined,
        timeoutMs: 180000,
        meeClient: undefined,
        transactionType: 'chain',
      });

      // Test check functions were called
      expect(checkFn).toHaveBeenCalledTimes(1);
      expect(checkFn).toHaveBeenCalledWith(fakeTransactionReceipt);

      // Check notification was updated
      expect(updateNotification).toHaveBeenCalledTimes(1);
      expect(updateNotification).toHaveBeenCalledWith({
        id: fakeContractTransaction.hash,
        variant: 'error',
        title: en.transactionNotification.failed.title,
      });
    },
  );

  it('handles a transaction that failed', async () => {
    (waitForTransaction as Mock).mockImplementation(async () => ({
      transactionReceipt: {
        ...fakeTransactionReceipt,
        status: 'reverted',
      },
    }));

    const { result } = renderHook(() => useTrackTransaction());
    const trackTransaction = result.current;

    const onRevertedMock = vi.fn();

    await trackTransaction({
      transactionHash: fakeContractTransaction.hash,
      onReverted: onRevertedMock,
    });

    // Check loading notification was displayed
    expect(displayNotification).toHaveBeenCalledTimes(1);
    expect(displayNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'loading',
      autoClose: false,
      title: en.transactionNotification.pending.title,
      description: (
        <ChainExplorerLink
          chainId={ChainId.BSC_TESTNET}
          hash={fakeContractTransaction.hash}
          urlType="tx"
        />
      ),
    });

    // Check transaction was awaited
    expect(waitForTransaction).toHaveBeenCalledTimes(1);
    expect(waitForTransaction).toHaveBeenCalledWith({
      chainId: ChainId.BSC_TESTNET,
      confirmations: CONFIRMATIONS,
      hash: fakeContractTransaction.hash,
      isRunningInSafeApp: false,
      publicClient: undefined,
      timeoutMs: 180000,
      meeClient: undefined,
      transactionType: 'chain',
    });

    // Check notification was updated
    expect(updateNotification).toHaveBeenCalledTimes(1);
    expect(updateNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'error',
      title: en.transactionNotification.failed.title,
    });

    // Check callback was executed
    expect(onRevertedMock).toHaveBeenCalledTimes(1);
    expect(onRevertedMock).toHaveBeenCalledWith({ transactionHash: fakeContractTransaction.hash });
  });

  it('handles a transaction that succeeded', async () => {
    const { result } = renderHook(() => useTrackTransaction());
    const trackTransaction = result.current;

    const onConfirmedMock = vi.fn();

    await trackTransaction({
      transactionHash: fakeContractTransaction.hash,
      onConfirmed: onConfirmedMock,
    });

    // Check loading notification was displayed
    expect(displayNotification).toHaveBeenCalledTimes(1);
    expect(displayNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'loading',
      autoClose: false,
      title: en.transactionNotification.pending.title,
      description: (
        <ChainExplorerLink
          chainId={ChainId.BSC_TESTNET}
          hash={fakeContractTransaction.hash}
          urlType="tx"
        />
      ),
    });

    // Check transaction was awaited
    expect(waitForTransaction).toHaveBeenCalledTimes(1);
    expect(waitForTransaction).toHaveBeenCalledWith({
      chainId: ChainId.BSC_TESTNET,
      confirmations: CONFIRMATIONS,
      hash: fakeContractTransaction.hash,
      isRunningInSafeApp: false,
      publicClient: undefined,
      timeoutMs: 180000,
      meeClient: undefined,
      transactionType: 'chain',
    });

    // Check notification was updated
    expect(updateNotification).toHaveBeenCalledTimes(1);
    expect(updateNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'success',
      title: en.transactionNotification.success.title,
    });

    // Check callback was executed
    expect(onConfirmedMock).toHaveBeenCalledTimes(1);
    expect(onConfirmedMock).toHaveBeenCalledWith({
      transactionHash: fakeContractTransaction.hash,
      transactionReceipt: fakeTransactionReceipt,
    });
  });
});

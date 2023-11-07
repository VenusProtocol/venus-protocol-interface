import { renderHook } from '@testing-library/react-hooks';
import { ChainExplorerLink } from 'components';
import {
  checkForComptrollerTransactionError,
  checkForTokenTransactionError,
  checkForVaiControllerTransactionError,
  checkForVaiVaultTransactionError,
  checkForXvsVaultProxyTransactionError,
  logError,
} from 'errors';
import { ChainId } from 'types';
import { displayNotification, updateNotification } from 'utilities';
import Vi from 'vitest';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeProvider from '__mocks__/models/provider';
import { useAuth } from 'context/AuthContext';
import en from 'translation/translations/en.json';

import { CONFIRMATIONS, TIMEOUT_MS, useTrackTransaction } from '..';

vi.mock('context/ErrorLogger');
vi.mock('context/AuthContext');
vi.mock('utilities/notifications');
vi.mock('errors');

const fakeError = new Error('Fake error');

describe('useTrackTransaction', () => {
  beforeEach(() => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: undefined,
      provider: fakeProvider,
      chainId: ChainId.BSC_TESTNET,
    }));

    (displayNotification as Vi.Mock).mockImplementation(({ id }: { id: string | number }) => id);

    (fakeProvider.waitForTransaction as Vi.Mock).mockImplementation(
      async () => fakeContractReceipt,
    );
  });

  it('handles errors from provider', async () => {
    (fakeProvider.waitForTransaction as Vi.Mock).mockImplementation(async () => {
      throw fakeError;
    });

    const { result } = renderHook(() => useTrackTransaction());
    const trackTransaction = result.current;

    await trackTransaction({
      transaction: fakeContractTransaction,
    });

    // Check loading notification was displayed
    expect(displayNotification).toHaveBeenCalledTimes(1);
    expect(displayNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'loading',
      title: en.transactionNotification.pending.title,
      description: (
        <ChainExplorerLink
          chainId={ChainId.BSC_TESTNET}
          hash={fakeContractTransaction.hash}
          urlType="tx"
        />
      ),
    });

    // Check provider was called
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledTimes(1);
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledWith(
      fakeContractTransaction.hash,
      CONFIRMATIONS,
      TIMEOUT_MS,
    );

    // Check error was logged
    expect(logError).toHaveBeenCalledTimes(1);
    expect(logError).toHaveBeenCalledWith(fakeError);

    // Check notification was updated
    expect(updateNotification).toBeCalledTimes(1);
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
      (checkFn as Vi.Mock).mockImplementation(() => {
        throw fakeError;
      });

      const { result } = renderHook(() => useTrackTransaction());
      const trackTransaction = result.current;

      await trackTransaction({
        transaction: fakeContractTransaction,
      });

      // Check loading notification was displayed
      expect(displayNotification).toHaveBeenCalledTimes(1);
      expect(displayNotification).toHaveBeenCalledWith({
        id: fakeContractTransaction.hash,
        variant: 'loading',
        title: en.transactionNotification.pending.title,
        description: (
          <ChainExplorerLink
            chainId={ChainId.BSC_TESTNET}
            hash={fakeContractTransaction.hash}
            urlType="tx"
          />
        ),
      });

      // Check provider was called
      expect(fakeProvider.waitForTransaction).toHaveBeenCalledTimes(1);
      expect(fakeProvider.waitForTransaction).toHaveBeenCalledWith(
        fakeContractTransaction.hash,
        CONFIRMATIONS,
        TIMEOUT_MS,
      );

      // Test check functions were called
      expect(checkFn).toHaveBeenCalledTimes(1);
      expect(checkFn).toHaveBeenCalledWith(fakeContractReceipt);

      // Check notification was updated
      expect(updateNotification).toBeCalledTimes(1);
      expect(updateNotification).toHaveBeenCalledWith({
        id: fakeContractTransaction.hash,
        variant: 'error',
        title: en.transactionNotification.failed.title,
      });
    },
  );

  it('handles a transaction that failed', async () => {
    (fakeProvider.waitForTransaction as Vi.Mock).mockImplementation(async () => ({
      ...fakeContractReceipt,
      status: 0, // Failed transaction status
    }));

    const { result } = renderHook(() => useTrackTransaction());
    const trackTransaction = result.current;

    const onRevertedMock = vi.fn();

    await trackTransaction({
      transaction: fakeContractTransaction,
      onReverted: onRevertedMock,
    });

    // Check loading notification was displayed
    expect(displayNotification).toHaveBeenCalledTimes(1);
    expect(displayNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'loading',
      title: en.transactionNotification.pending.title,
      description: (
        <ChainExplorerLink
          chainId={ChainId.BSC_TESTNET}
          hash={fakeContractTransaction.hash}
          urlType="tx"
        />
      ),
    });

    // Check provider was called
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledTimes(1);
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledWith(
      fakeContractTransaction.hash,
      CONFIRMATIONS,
      TIMEOUT_MS,
    );

    // Check notification was updated
    expect(updateNotification).toBeCalledTimes(1);
    expect(updateNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'error',
      title: en.transactionNotification.failed.title,
    });

    // Check callback was executed
    expect(onRevertedMock).toHaveBeenCalledTimes(1);
    expect(onRevertedMock).toHaveBeenCalledWith({ transaction: fakeContractTransaction });
  });

  it('handles a transaction that succeeded', async () => {
    const { result } = renderHook(() => useTrackTransaction());
    const trackTransaction = result.current;

    const onConfirmedMock = vi.fn();

    await trackTransaction({
      transaction: fakeContractTransaction,
      onConfirmed: onConfirmedMock,
    });

    // Check loading notification was displayed
    expect(displayNotification).toHaveBeenCalledTimes(1);
    expect(displayNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'loading',
      title: en.transactionNotification.pending.title,
      description: (
        <ChainExplorerLink
          chainId={ChainId.BSC_TESTNET}
          hash={fakeContractTransaction.hash}
          urlType="tx"
        />
      ),
    });

    // Check provider was called
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledTimes(1);
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledWith(
      fakeContractTransaction.hash,
      CONFIRMATIONS,
      TIMEOUT_MS,
    );

    // Check notification was updated
    expect(updateNotification).toBeCalledTimes(1);
    expect(updateNotification).toHaveBeenCalledWith({
      id: fakeContractTransaction.hash,
      variant: 'success',
      title: en.transactionNotification.success.title,
    });

    // Check callback was executed
    expect(onConfirmedMock).toHaveBeenCalledTimes(1);
    expect(onConfirmedMock).toHaveBeenCalledWith({
      transaction: fakeContractTransaction,
      transactionReceipt: fakeContractReceipt,
    });
  });
});

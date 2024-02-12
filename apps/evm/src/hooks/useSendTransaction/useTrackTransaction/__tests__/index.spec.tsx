import Vi from 'vitest';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeProvider from '__mocks__/models/provider';
import { renderHook } from 'testUtils/render';

import { CHAIN_METADATA } from 'constants/chainMetadata';
import { ChainExplorerLink } from 'containers/ChainExplorerLink';
import {
  checkForComptrollerTransactionError,
  checkForTokenTransactionError,
  checkForVaiControllerTransactionError,
  checkForVaiVaultTransactionError,
  checkForXvsVaultProxyTransactionError,
} from 'packages/errors';
import { displayNotification, updateNotification } from 'packages/notifications';
import { en } from 'packages/translations';
import { useProvider } from 'packages/wallet';
import { ChainId } from 'types';

import { CONFIRMATIONS, useTrackTransaction } from '..';

vi.mock('context/ErrorLogger');
vi.mock('packages/notifications');
vi.mock('packages/errors');
vi.mock('errors');

const fakeError = new Error('Fake error');

describe('useTrackTransaction', () => {
  beforeEach(() => {
    (displayNotification as Vi.Mock).mockImplementation(({ id }: { id: string | number }) => id);

    (fakeProvider.waitForTransaction as Vi.Mock).mockImplementation(
      async () => fakeContractReceipt,
    );

    (useProvider as Vi.Mock).mockImplementation(() => ({
      provider: fakeProvider,
    }));
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

    // Check provider was called
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledTimes(1);
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledWith(
      fakeContractTransaction.hash,
      CONFIRMATIONS,
      CHAIN_METADATA[ChainId.BSC_TESTNET].blockTimeMs * 10,
    );

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

      // Check provider was called
      expect(fakeProvider.waitForTransaction).toHaveBeenCalledTimes(1);
      expect(fakeProvider.waitForTransaction).toHaveBeenCalledWith(
        fakeContractTransaction.hash,
        CONFIRMATIONS,
        CHAIN_METADATA[ChainId.BSC_TESTNET].blockTimeMs * 10,
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

    // Check provider was called
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledTimes(1);
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledWith(
      fakeContractTransaction.hash,
      CONFIRMATIONS,
      CHAIN_METADATA[ChainId.BSC_TESTNET].blockTimeMs * 10,
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

    // Check provider was called
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledTimes(1);
    expect(fakeProvider.waitForTransaction).toHaveBeenCalledWith(
      fakeContractTransaction.hash,
      CONFIRMATIONS,
      CHAIN_METADATA[ChainId.BSC_TESTNET].blockTimeMs * 10,
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

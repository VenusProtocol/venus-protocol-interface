import { ChainExplorerLink } from 'components';
import {
  checkForComptrollerTransactionError,
  checkForTokenTransactionError,
  checkForVaiControllerTransactionError,
  checkForVaiVaultTransactionError,
  checkForXvsVaultProxyTransactionError,
  logError,
} from 'errors';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { useTranslation } from 'packages/translations';
import { useCallback } from 'react';
import { displayNotification, updateNotification } from 'utilities';

import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useAuth } from 'context/AuthContext';

export const CONFIRMATIONS = 2;

interface TrackTransactionInput {
  transaction: ContractTransaction;
  onConfirmed?: (input: {
    transaction: ContractTransaction;
    transactionReceipt: ContractReceipt;
  }) => Promise<unknown> | unknown;
  onReverted?: (input: { transaction: ContractTransaction }) => Promise<unknown> | unknown;
}

export const useTrackTransaction = () => {
  const { provider, chainId } = useAuth();
  const { t } = useTranslation();

  const trackTransaction = useCallback(
    async ({ transaction, onConfirmed, onReverted }: TrackTransactionInput) => {
      // Display notification indicating transaction is being processed
      const notificationId = displayNotification({
        id: transaction.hash,
        variant: 'loading',
        title: t('transactionNotification.pending.title'),
        description: <ChainExplorerLink chainId={chainId} hash={transaction.hash} urlType="tx" />,
      });

      let transactionReceipt: ContractReceipt | undefined;

      const timeoutMs = CHAIN_METADATA[chainId].blockTimeMs * 10; // 10 blocks

      try {
        transactionReceipt = await provider.waitForTransaction(
          transaction.hash,
          CONFIRMATIONS,
          timeoutMs,
        );
      } catch (error) {
        logError(error);
      }

      if (typeof transactionReceipt?.status !== 'number') {
        // Update corresponding notification to say transaction receipt could not be fetched
        updateNotification({
          id: notificationId,
          variant: 'warning',
          title: t('transactionNotification.couldNotFetchReceipt.title'),
        });

        return;
      }

      let transactionSucceeded = transactionReceipt.status === 1;

      // Check for non-reverting errors
      try {
        checkForComptrollerTransactionError(transactionReceipt);
        checkForTokenTransactionError(transactionReceipt);
        checkForVaiControllerTransactionError(transactionReceipt);
        checkForVaiVaultTransactionError(transactionReceipt);
        checkForXvsVaultProxyTransactionError(transactionReceipt);
      } catch (_error) {
        transactionSucceeded = false;
      }

      if (!transactionSucceeded) {
        // Update corresponding notification to say transaction failed
        updateNotification({
          id: notificationId,
          variant: 'error',
          title: t('transactionNotification.failed.title'),
        });

        // Execute callback
        await onReverted?.({ transaction });
        return;
      }

      // Update corresponding notification to say transaction succeeded
      updateNotification({
        id: notificationId,
        variant: 'success',
        title: t('transactionNotification.success.title'),
      });

      // Execute callback
      await onConfirmed?.({ transaction, transactionReceipt });
    },
    [chainId, provider, t],
  );

  return trackTransaction;
};

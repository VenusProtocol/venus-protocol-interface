import { ContractReceipt, ContractTransaction } from 'ethers';
import { useCallback } from 'react';

import { ChainExplorerLink } from 'containers/ChainExplorerLink';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import {
  checkForComptrollerTransactionError,
  checkForTokenTransactionError,
  checkForVaiControllerTransactionError,
  checkForVaiVaultTransactionError,
  checkForXvsVaultProxyTransactionError,
} from 'libs/errors';
import { displayNotification, updateNotification } from 'libs/notifications';
import { useTranslation } from 'libs/translations';
import { useChainId, useProvider } from 'libs/wallet';
import { TransactionType } from 'types';
import { UrlType } from 'utilities';

export const CONFIRMATIONS = 2;

interface UseTrackTransactionInput {
  transactionType?: TransactionType;
}

interface TrackTransactionInput {
  transaction: ContractTransaction;
  onConfirmed?: (input: {
    transaction: ContractTransaction;
    transactionReceipt: ContractReceipt;
  }) => Promise<unknown> | unknown;
  onReverted?: (input: { transaction: ContractTransaction }) => Promise<unknown> | unknown;
}

export const useTrackTransaction = (
  { transactionType }: UseTrackTransactionInput = { transactionType: 'chain' },
) => {
  const { provider } = useProvider();
  const { chainId } = useChainId();
  const { blockTimeMs } = useGetChainMetadata();
  const { t } = useTranslation();

  const trackTransaction = useCallback(
    async ({ transaction, onConfirmed, onReverted }: TrackTransactionInput) => {
      const urlType: UrlType = transactionType === 'layerZero' ? 'layerZeroTx' : 'tx';
      // Display notification indicating transaction is being processed
      const notificationId = displayNotification({
        id: transaction.hash,
        variant: 'loading',
        autoClose: false,
        title: t('transactionNotification.pending.title'),
        description: (
          <ChainExplorerLink chainId={chainId} hash={transaction.hash} urlType={urlType} />
        ),
      });

      let transactionReceipt: ContractReceipt | undefined;

      const timeoutMs = blockTimeMs * 10; // 10 blocks

      try {
        transactionReceipt = await provider.waitForTransaction(
          transaction.hash,
          CONFIRMATIONS,
          timeoutMs,
        );
      } catch {
        // Do nothing
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
    [chainId, provider, t, blockTimeMs, transactionType],
  );

  return trackTransaction;
};

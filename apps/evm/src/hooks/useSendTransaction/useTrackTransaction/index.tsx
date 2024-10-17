import type { ContractReceipt } from 'ethers';
import { useCallback } from 'react';

import { ChainExplorerLink } from 'containers/ChainExplorerLink';
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
import type { TransactionType } from 'types';
import type { UrlType } from 'utilities';
import { CONFIRMATIONS, TIMEOUT_MS } from '../constants';

interface UseTrackTransactionInput {
  transactionType?: TransactionType;
}

interface TrackTransactionInput {
  transactionHash: string;
  onConfirmed?: (input: {
    transactionHash: string;
    transactionReceipt: ContractReceipt;
  }) => Promise<unknown> | unknown;
  onReverted?: (input: { transactionHash: string }) => Promise<unknown> | unknown;
}

export const useTrackTransaction = (
  { transactionType }: UseTrackTransactionInput = { transactionType: 'chain' },
) => {
  const { provider } = useProvider();
  const { chainId } = useChainId();
  const { t } = useTranslation();

  const trackTransaction = useCallback(
    async ({ transactionHash, onConfirmed, onReverted }: TrackTransactionInput) => {
      const urlType: UrlType = transactionType === 'layerZero' ? 'layerZeroTx' : 'tx';
      // Display notification indicating transaction is being processed
      const notificationId = displayNotification({
        id: transactionHash,
        variant: 'loading',
        autoClose: false,
        title: t('transactionNotification.pending.title'),
        description: (
          <ChainExplorerLink chainId={chainId} hash={transactionHash} urlType={urlType} />
        ),
      });

      let transactionReceipt: ContractReceipt | undefined;

      try {
        transactionReceipt = await provider.waitForTransaction(
          transactionHash,
          CONFIRMATIONS,
          TIMEOUT_MS,
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
        await onReverted?.({ transactionHash });
        return;
      }

      // Update corresponding notification to say transaction succeeded
      updateNotification({
        id: notificationId,
        variant: 'success',
        title: t('transactionNotification.success.title'),
      });

      // Execute callback
      await onConfirmed?.({ transactionHash, transactionReceipt });
    },
    [chainId, provider, t, transactionType],
  );

  return trackTransaction;
};

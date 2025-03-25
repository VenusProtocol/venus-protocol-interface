import type { ContractReceipt } from 'ethers';
import { useCallback } from 'react';

import config from 'config';
import { ChainExplorerLink } from 'containers/ChainExplorerLink';
import {
  VError,
  checkForComptrollerTransactionError,
  checkForTokenTransactionError,
  checkForVaiControllerTransactionError,
  checkForVaiVaultTransactionError,
  checkForXvsVaultProxyTransactionError,
  logError,
} from 'libs/errors';
import { type Notification, displayNotification, updateNotification } from 'libs/notifications';
import { useTranslation } from 'libs/translations';
import { useChainId, useProvider } from 'libs/wallet';
import type { TransactionType } from 'types';
import type { UrlType } from 'utilities';
import type { Hex } from 'viem';
import { CONFIRMATIONS, TIMEOUT_MS } from '../constants';
import { waitForTransaction } from './waitForTransaction';

interface UseTrackTransactionInput {
  transactionType?: TransactionType;
}

interface TrackTransactionInput {
  transactionHash: Hex;
  onConfirmed?: (input: {
    transactionHash: Hex;
    transactionReceipt: ContractReceipt;
  }) => Promise<unknown> | unknown;
  onReverted?: (input: { transactionHash: Hex }) => Promise<unknown> | unknown;
}

// TODO: update tests

export const useTrackTransaction = (
  { transactionType }: UseTrackTransactionInput = { transactionType: 'chain' },
) => {
  const { provider } = useProvider();
  const { chainId } = useChainId();
  const { t } = useTranslation();

  const trackTransaction = useCallback(
    async ({ transactionHash, onConfirmed, onReverted }: TrackTransactionInput) => {
      const urlType: UrlType = transactionType === 'layerZero' ? 'layerZeroTx' : 'tx';
      let notificationId: Notification['id'] | undefined;

      // Display notification indicating transaction is being processed. Note that we don't display
      // notifications when running in the Safe Wallet app because it has its own notification
      // system for transactions.
      if (!config.isSafeApp) {
        notificationId = displayNotification({
          id: transactionHash,
          variant: 'loading',
          autoClose: false,
          title: t('transactionNotification.pending.title'),
          description: (
            <ChainExplorerLink chainId={chainId} hash={transactionHash} urlType={urlType} />
          ),
        });
      }

      let transactionReceipt: ContractReceipt | undefined;

      try {
        const { transactionReceipt: receipt } = await waitForTransaction({
          provider,
          isSafeWalletTransaction: config.isSafeApp,
          hash: transactionHash,
          confirmations: CONFIRMATIONS,
          timeoutMs: TIMEOUT_MS,
        });

        transactionReceipt = receipt;
      } catch (error) {
        if (error instanceof VError && error.code === 'missingSafeWalletApiUrl') {
          logError(
            "Could not retrieve transaction hash from Safe Wallet's API: missing Safe Wallet API URL",
          );
        }
      }

      if (typeof transactionReceipt?.status !== 'number' && notificationId !== undefined) {
        // Update corresponding notification to say transaction receipt could not be fetched
        updateNotification({
          id: notificationId,
          variant: 'warning',
          title: t('transactionNotification.couldNotFetchReceipt.title'),
        });
      }

      if (typeof transactionReceipt?.status !== 'number') {
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

      if (notificationId) {
        // Update corresponding notification
        updateNotification({
          id: notificationId,
          variant: transactionSucceeded ? 'success' : 'error',
          title: transactionSucceeded
            ? t('transactionNotification.success.title')
            : t('transactionNotification.failed.title'),
        });
      }

      if (transactionSucceeded) {
        // Execute callback
        await onConfirmed?.({ transactionHash, transactionReceipt });
        return;
      }

      // Execute callback
      await onReverted?.({ transactionHash });
    },
    [chainId, provider, t, transactionType],
  );

  return trackTransaction;
};

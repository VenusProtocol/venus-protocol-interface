import type { GetSupertransactionReceiptPayloadWithReceipts } from '@biconomy/abstractjs-canary';
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
import { useChainId, useMeeClient, usePublicClient } from 'libs/wallet';
import type { TransactionType } from 'types';
import type { UrlType } from 'utilities';
import type { Hex, TransactionReceipt } from 'viem';
import { CONFIRMATIONS, TIMEOUT_MS } from '../constants';
import { getTransactionStatus } from './getTransactionStatus';
import { waitForTransaction } from './waitForTransaction';

interface UseTrackTransactionInput {
  transactionType?: TransactionType;
}

interface TrackTransactionInput {
  transactionHash: Hex;
  onConfirmed?: (input: {
    transactionHash: Hex;
    transactionReceipt: TransactionReceipt | GetSupertransactionReceiptPayloadWithReceipts;
  }) => Promise<unknown> | unknown;
  onReverted?: (input: { transactionHash: Hex }) => Promise<unknown> | unknown;
}

export const useTrackTransaction = (input?: UseTrackTransactionInput) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { t } = useTranslation();
  const transactionType = input?.transactionType || 'chain';

  const { data } = useMeeClient({ chainId }, { enabled: transactionType === 'biconomy' });
  const meeClient = data?.meeClient;

  const trackTransaction = useCallback(
    async ({ transactionHash, onConfirmed, onReverted }: TrackTransactionInput) => {
      let urlType: UrlType = 'tx';
      if (transactionType === 'layerZero') {
        urlType = 'layerZeroTx';
      } else if (transactionType === 'biconomy') {
        urlType = 'biconomyTx';
      }

      let notificationId: Notification['id'] | undefined;

      // Display notification indicating transaction is being processed. Note that we don't display
      // notifications when running in the Safe Wallet app, unless we're sending a transaction via
      // Biconomy, because it has its own notification system for transactions.
      if (!config.isSafeApp || transactionType === 'biconomy') {
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

      let transactionReceipt:
        | TransactionReceipt
        | GetSupertransactionReceiptPayloadWithReceipts
        | undefined;

      try {
        const { transactionReceipt: receipt } = await waitForTransaction({
          chainId,
          publicClient,
          meeClient,
          transactionType,
          isRunningInSafeApp: config.isSafeApp,
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

      const transactionStatus = getTransactionStatus({ transactionReceipt });

      if (!transactionStatus && notificationId !== undefined) {
        // Update corresponding notification to say transaction receipt could not be fetched
        updateNotification({
          id: notificationId,
          variant: 'warning',
          title: t('transactionNotification.couldNotFetchReceipt.title'),
        });
      }

      if (!transactionStatus || !transactionReceipt) {
        return;
      }

      let transactionSucceeded = transactionStatus === 'success';

      const receipts =
        'transactionStatus' in transactionReceipt
          ? // Biconmy transactions can return multiple receipts (since they bundle multiple
            // transactions together)
            transactionReceipt.receipts
          : [transactionReceipt];

      // Check for non-reverting errors
      try {
        receipts.forEach(receipt => {
          checkForComptrollerTransactionError(receipt);
          checkForTokenTransactionError(receipt);
          checkForVaiControllerTransactionError(receipt);
          checkForVaiVaultTransactionError(receipt);
          checkForXvsVaultProxyTransactionError(receipt);
        });
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
    [chainId, t, publicClient, transactionType, meeClient],
  );

  return trackTransaction;
};

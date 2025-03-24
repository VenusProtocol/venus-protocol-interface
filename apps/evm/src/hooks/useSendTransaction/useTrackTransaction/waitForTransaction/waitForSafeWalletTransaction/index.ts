import type { ChainId } from '@venusprotocol/chains';
import { VError } from 'libs/errors';
import type { Hex } from 'viem';

import { getSafeWalletTransaction } from './getSafeWalletTransaction';

export const WAIT_INTERVAL_MS = 1000;

export const waitForSafeWalletTransaction = ({
  chainId,
  hash,
  timeoutMs,
}: {
  chainId: ChainId;
  hash: Hex;
  timeoutMs: number;
}) =>
  new Promise<{ transactionHash: Hex | undefined }>((resolve, reject) => {
    const startTimeMs = Date.now();

    // We'll try up to MAX_TRIES times to fetch the transaction from Safe, waiting in between each
    // attempt. The reason we need to do this is because once a transaction is sent to Safe it takes
    // some time before it is confirmed and the API returns the transaction hash of the final
    // transaction.
    const attemptFetch = async () => {
      const time = Date.now();

      // Resolve if we've reached the timeout
      if (time - startTimeMs >= timeoutMs) {
        resolve({
          transactionHash: undefined,
        });
        return;
      }

      try {
        // Attempt to fetch transaction hash from Safe Wallet's API
        const { safeWalletTransaction } = await getSafeWalletTransaction({
          chainId,
          hash,
        });

        // Return transaction hash if Safe Wallet transaction has been found and has collected all
        // the signatures
        if (safeWalletTransaction?.transactionHash) {
          resolve({ transactionHash: safeWalletTransaction.transactionHash });
          return;
        }
      } catch (error) {
        if (error instanceof VError && error.code === 'missingSafeWalletApiUrl') {
          // Bubble up error
          reject(error);
          return;
        }
      }

      // Wait before the next attempt
      setTimeout(attemptFetch, WAIT_INTERVAL_MS);
    };

    attemptFetch();
  });

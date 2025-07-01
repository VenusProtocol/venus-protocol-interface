import type { MeeClient } from '@biconomy/abstractjs';
import type { ChainId } from '@venusprotocol/chains';
import { VError } from 'libs/errors';
import type { TransactionType } from 'types';
import type { Hex, PublicClient, TransactionReceipt } from 'viem';
import { waitForSafeWalletTransaction } from './waitForSafeWalletTransaction';

export const WAIT_INTERVAL_MS = 1000;

export const waitForTransaction = async ({
  chainId,
  publicClient,
  hash,
  confirmations,
  isRunningInSafeApp,
  timeoutMs,
  transactionType,
  meeClient,
}: {
  chainId: ChainId;
  publicClient: PublicClient;
  hash: Hex;
  isRunningInSafeApp: boolean;
  confirmations: number;
  timeoutMs: number;
  transactionType: TransactionType;
  meeClient?: MeeClient;
}) => {
  let transactionHash: Hex | undefined = undefined;

  if (transactionType === 'biconomy' && !meeClient) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  if (transactionType === 'biconomy') {
    const transactionReceipt = await meeClient!.waitForSupertransactionReceipt({ hash });
    return { transactionReceipt };
  }

  if (isRunningInSafeApp) {
    const { transactionHash: tmpHash } = await waitForSafeWalletTransaction({
      chainId,
      hash,
      timeoutMs,
    });

    transactionHash = tmpHash;
  } else {
    transactionHash = hash;
  }

  let transactionReceipt: TransactionReceipt | undefined;

  if (transactionHash) {
    // Retrieve transaction from RPC provider
    transactionReceipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
      confirmations,
      timeout: timeoutMs,
    });
  }

  return { transactionReceipt };
};

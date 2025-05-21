import type { ChainId } from '@venusprotocol/chains';
import type { Hex, PublicClient, TransactionReceipt } from 'viem';
import { waitForSafeWalletTransaction } from './waitForSafeWalletTransaction';

export const WAIT_INTERVAL_MS = 1000;

export const waitForTransaction = async ({
  chainId,
  publicClient,
  hash,
  confirmations,
  isSafeWalletTransaction,
  timeoutMs,
}: {
  chainId: ChainId;
  publicClient: PublicClient;
  hash: Hex;
  isSafeWalletTransaction: boolean;
  confirmations: number;
  timeoutMs: number;
}) => {
  let transactionHash: Hex | undefined = undefined;

  if (isSafeWalletTransaction) {
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

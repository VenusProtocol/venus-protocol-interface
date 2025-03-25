import type { ChainId } from '@venusprotocol/chains';
import type { ContractReceipt } from 'ethers';
import type { Provider } from 'libs/wallet';
import type { Hex } from 'viem';
import { waitForSafeWalletTransaction } from './waitForSafeWalletTransaction';

export const WAIT_INTERVAL_MS = 1000;

export const waitForTransaction = async ({
  provider,
  hash,
  confirmations,
  isSafeWalletTransaction,
  timeoutMs,
}: {
  provider: Provider;
  hash: Hex;
  isSafeWalletTransaction: boolean;
  confirmations: number;
  timeoutMs: number;
}) => {
  let transactionHash: Hex | undefined = undefined;

  if (isSafeWalletTransaction) {
    const { transactionHash: tmpHash } = await waitForSafeWalletTransaction({
      chainId: provider.network.chainId as ChainId,
      hash,
      timeoutMs,
    });

    transactionHash = tmpHash;
  } else {
    transactionHash = hash;
  }

  let transactionReceipt: ContractReceipt | undefined;

  if (transactionHash) {
    // Retrieve transaction from RPC provider
    transactionReceipt = await provider.waitForTransaction(
      transactionHash,
      confirmations,
      timeoutMs,
    );
  }

  return { transactionReceipt };
};

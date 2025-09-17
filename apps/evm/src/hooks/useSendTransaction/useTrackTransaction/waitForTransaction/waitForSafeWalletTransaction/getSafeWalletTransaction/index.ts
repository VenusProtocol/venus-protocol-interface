import { type ChainId, chainMetadata } from '@venusprotocol/chains';
import config from 'config';
import { VError, logError } from 'libs/errors';
import type { Hex } from 'viem';

export interface SafeWalletTransaction {
  transactionHash: Hex | null;
  isSuccessful: boolean | null;
  confirmationsRequired: number;
  confirmations: Record<string, unknown>[];
}

export const getSafeWalletTransaction = async ({
  chainId,
  hash,
}: {
  chainId: ChainId;
  hash: Hex;
}) => {
  const safeWalletApiUrl = chainMetadata[chainId].safeWalletApiUrl;

  if (!safeWalletApiUrl) {
    logError(`Missing Safe Wallet API URL on ${chainMetadata[chainId]}`);

    throw new VError({
      type: 'unexpected',
      code: 'missingSafeWalletApiUrl',
    });
  }

  // Retrieve transaction from Safe Wallet's API
  const response = await fetch(`${safeWalletApiUrl}/api/v2/multisig-transactions/${hash}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.safeApiKey}`,
    },
  });

  if (!response.ok) {
    logError(`Request to Safe Wallet's API failed: ${response.statusText}`);

    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  try {
    const safeWalletTransaction: SafeWalletTransaction | undefined = await response.json();

    return {
      safeWalletTransaction,
    };
  } catch (error) {
    logError(`Could not parse JSON response from Safe Wallet's API: ${error}`);

    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }
};

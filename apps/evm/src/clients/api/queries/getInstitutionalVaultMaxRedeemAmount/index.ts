import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { institutionalVaultAbi } from 'libs/contracts';

export interface GetInstitutionalVaultMaxRedeemAmountInput {
  accountAddress: Address;
  vaultAddress: Address;
  publicClient: PublicClient;
}

export interface GetInstitutionalVaultMaxRedeemAmountOutput {
  amountMantissa: BigNumber;
}

export const getInstitutionalVaultMaxRedeemAmount = async ({
  publicClient,
  accountAddress,
  vaultAddress,
}: GetInstitutionalVaultMaxRedeemAmountInput): Promise<GetInstitutionalVaultMaxRedeemAmountOutput> => {
  const result = await publicClient.readContract({
    abi: institutionalVaultAbi,
    address: vaultAddress,
    functionName: 'maxRedeem',
    args: [accountAddress],
  });

  return {
    amountMantissa: new BigNumber(result.toString()),
  };
};

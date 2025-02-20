import BigNumber from 'bignumber.js';
import { MIN_PAYMASTER_BALANCE_MANTISSA } from 'constants/gasLess';
import { zyFiVaultAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetPaymasterInfoInput {
  publicClient: PublicClient;
  zyFiVaultContractAddress: Address;
  zyFiWalletAddress: Address;
}

export type GetPaymasterInfoOutput = {
  balanceMantissa: BigNumber;
  canSponsorTransactions: boolean;
};

export const getPaymasterInfo = async ({
  publicClient,
  zyFiVaultContractAddress,
  zyFiWalletAddress,
}: GetPaymasterInfoInput): Promise<GetPaymasterInfoOutput> => {
  const balanceResult = await publicClient.readContract({
    address: zyFiVaultContractAddress,
    abi: zyFiVaultAbi,
    functionName: 'balances',
    args: [zyFiWalletAddress],
  });

  const balanceMantissa = new BigNumber(balanceResult.toString());
  const canSponsorTransactions = balanceMantissa.gte(MIN_PAYMASTER_BALANCE_MANTISSA);

  return {
    balanceMantissa,
    canSponsorTransactions,
  };
};

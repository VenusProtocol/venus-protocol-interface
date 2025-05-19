import BigNumber from 'bignumber.js';
import { xvsVaultAbi } from 'libs/contracts';

import type { Address, PublicClient } from 'viem';

export interface GetXvsVaultPendingWithdrawalsBalanceInput {
  publicClient: PublicClient;
  xvsVaultContractAddress: Address;
  rewardTokenAddress: Address;
  poolIndex: number;
}

export type GetXvsVaultPendingWithdrawalsBalanceOutput = {
  balanceMantissa: BigNumber;
};

export const getXvsVaultPendingWithdrawalsBalance = async ({
  publicClient,
  xvsVaultContractAddress,
  rewardTokenAddress,
  poolIndex,
}: GetXvsVaultPendingWithdrawalsBalanceInput): Promise<GetXvsVaultPendingWithdrawalsBalanceOutput> => {
  const resp = await publicClient.readContract({
    address: xvsVaultContractAddress,
    abi: xvsVaultAbi,
    functionName: 'totalPendingWithdrawals',
    args: [rewardTokenAddress, BigInt(poolIndex)],
  });

  return {
    balanceMantissa: new BigNumber(resp.toString()),
  };
};

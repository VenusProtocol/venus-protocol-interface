import BigNumber from 'bignumber.js';
import { xvsVaultAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput {
  publicClient: PublicClient;
  xvsVaultContractAddress: Address;
  rewardTokenAddress: Address;
  poolIndex: number;
  accountAddress: Address;
}

export interface GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput {
  userPendingWithdrawalsFromBeforeUpgradeMantissa: BigNumber;
}

export const getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade = async ({
  publicClient,
  xvsVaultContractAddress,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput): Promise<GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput> => {
  const res = await publicClient.readContract({
    address: xvsVaultContractAddress,
    abi: xvsVaultAbi,
    functionName: 'pendingWithdrawalsBeforeUpgrade',
    args: [rewardTokenAddress, BigInt(poolIndex), accountAddress],
  });

  return {
    userPendingWithdrawalsFromBeforeUpgradeMantissa: new BigNumber(res.toString()),
  };
};

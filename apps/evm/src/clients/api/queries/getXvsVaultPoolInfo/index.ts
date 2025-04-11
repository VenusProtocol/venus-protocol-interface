import BigNumber from 'bignumber.js';
import { xvsVaultAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetXvsVaultPoolInfoInput {
  publicClient: PublicClient;
  xvsVaultContractAddress: Address;
  rewardTokenAddress: Address;
  poolIndex: number;
}

export interface GetXvsVaultPoolInfoOutput {
  stakedTokenAddress: Address;
  allocationPoint: number;
  lastRewardBlock: number;
  accRewardPerShare: BigNumber;
  lockingPeriodMs: number;
}

export const getXvsVaultPoolInfo = async ({
  publicClient,
  xvsVaultContractAddress,
  rewardTokenAddress,
  poolIndex,
}: GetXvsVaultPoolInfoInput): Promise<GetXvsVaultPoolInfoOutput> => {
  const result = await publicClient.readContract({
    address: xvsVaultContractAddress,
    abi: xvsVaultAbi,
    functionName: 'poolInfos',
    args: [rewardTokenAddress, BigInt(poolIndex)],
  });

  // The result is a tuple, convert it to the expected object format
  const [token, allocPoint, lastRewardBlockOrSecond, accRewardPerShare, lockPeriod] = result;

  return {
    stakedTokenAddress: token,
    allocationPoint: Number(allocPoint),
    lastRewardBlock: Number(lastRewardBlockOrSecond),
    accRewardPerShare: new BigNumber(accRewardPerShare.toString()),
    // Convert lockPeriod from seconds to milliseconds
    lockingPeriodMs: Number(lockPeriod) * 1000,
  };
};

import BigNumber from 'bignumber.js';
import { xvsVaultAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetXvsVaultUserInfoInput {
  publicClient: PublicClient;
  xvsVaultContractAddress: Address;
  rewardTokenAddress: Address;
  poolIndex: number;
  accountAddress: Address;
}

export interface GetXvsVaultUserInfoOutput {
  stakedAmountMantissa: BigNumber;
  pendingWithdrawalsTotalAmountMantissa: BigNumber;
  rewardDebtAmountMantissa: BigNumber;
}

export const getXvsVaultUserInfo = async ({
  publicClient,
  xvsVaultContractAddress,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultUserInfoInput): Promise<GetXvsVaultUserInfoOutput> => {
  const [amount, rewardDebt, pendingWithdrawals] = await publicClient.readContract({
    address: xvsVaultContractAddress,
    abi: xvsVaultAbi,
    functionName: 'getUserInfo',
    args: [rewardTokenAddress, BigInt(poolIndex), accountAddress],
  });

  return {
    stakedAmountMantissa: new BigNumber(amount.toString()),
    pendingWithdrawalsTotalAmountMantissa: new BigNumber(pendingWithdrawals.toString()),
    rewardDebtAmountMantissa: new BigNumber(rewardDebt.toString()),
  };
};

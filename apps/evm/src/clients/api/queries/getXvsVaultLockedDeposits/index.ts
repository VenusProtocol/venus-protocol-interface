import BigNumber from 'bignumber.js';
import { xvsVaultAbi } from 'libs/contracts';
import type { LockedDeposit } from 'types';
import type { Address, PublicClient } from 'viem';

export interface GetXvsVaultLockedDepositsInput {
  publicClient: PublicClient;
  xvsVaultContractAddress: Address;
  rewardTokenAddress: Address;
  poolIndex: number;
  accountAddress: Address;
}

export type GetXvsVaultLockedDepositsOutput = {
  lockedDeposits: LockedDeposit[];
};

export const getXvsVaultLockedDeposits = async ({
  publicClient,
  xvsVaultContractAddress,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultLockedDepositsInput): Promise<GetXvsVaultLockedDepositsOutput> => {
  const withdrawalRequests = await publicClient.readContract({
    address: xvsVaultContractAddress,
    abi: xvsVaultAbi,
    functionName: 'getWithdrawalRequests',
    args: [rewardTokenAddress, BigInt(poolIndex), accountAddress],
  });

  const lockedDeposits = withdrawalRequests.map(withdrawalRequest => {
    const { amount, lockedUntil } = withdrawalRequest;

    // lockedUntil is a timestamp expressed in seconds, so we convert it to milliseconds
    const lockedUntilMs = Number(lockedUntil) * 1000;
    const unlockedAt = new Date(lockedUntilMs);

    return {
      amountMantissa: new BigNumber(amount.toString()),
      unlockedAt,
    };
  });

  return {
    lockedDeposits,
  };
};

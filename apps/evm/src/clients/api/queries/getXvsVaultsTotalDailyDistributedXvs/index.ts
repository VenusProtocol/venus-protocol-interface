import type BigNumber from 'bignumber.js';

import { xvsVaultAbi } from 'libs/contracts';
import type { Token } from 'types';
import { calculateDailyTokenRate } from 'utilities';
import type { Address, PublicClient } from 'viem';

export interface GetXvsVaultsTotalDailyDistributedXvsInput {
  publicClient: PublicClient;
  xvsVaultContractAddress: Address;
  stakedToken: Token;
  blocksPerDay?: number;
}

export type GetXvsVaultsTotalDailyDistributedXvsOutput = {
  dailyDistributedXvs: BigNumber;
};

export const getXvsVaultsTotalDailyDistributedXvs = async ({
  publicClient,
  xvsVaultContractAddress,
  stakedToken,
  blocksPerDay,
}: GetXvsVaultsTotalDailyDistributedXvsInput): Promise<GetXvsVaultsTotalDailyDistributedXvsOutput> => {
  const mantissaPerBlockOrSecond = await publicClient.readContract({
    address: xvsVaultContractAddress,
    abi: xvsVaultAbi,
    functionName: 'rewardTokenAmountsPerBlockOrSecond',
    args: [stakedToken.address],
  });

  const dailyDistributedXvs = calculateDailyTokenRate({
    rateMantissa: mantissaPerBlockOrSecond.toString(),
    decimals: stakedToken.decimals,
    blocksPerDay,
  });

  return {
    dailyDistributedXvs,
  };
};

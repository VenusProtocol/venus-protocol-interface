import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface PrimeUserPendingReward {
  marketAddress: Address;
  rewardTokenAddress: Address;
  currentCycleUsdMantissa: string;
}

export interface GetPrimeUserPendingRewardsInput {
  chainId: ChainId;
  accountAddress: Address;
}

export interface GetPrimeUserPendingRewardsOutput {
  blockNumber: string | null;
  isPrimeHolder: boolean;
  rank: number | null;
  totalCurrentCycleUsdMantissa: string;
  rewards: PrimeUserPendingReward[];
}

interface PrimeUserPendingRewardResponse {
  marketAddress: Address;
  rewardTokenAddress: Address;
  pendingAmountMantissa: string;
  currentCycleAmountMantissa: string;
  pendingUsdCents: string;
  pendingUsdMantissa: string;
  currentCycleUsdCents: string;
  currentCycleUsdMantissa: string;
}

interface GetPrimeUserPendingRewardsResponse {
  chainId: string;
  userAddress: Address;
  blockNumber: string | null;
  isPrimeHolder: boolean;
  rank: number | null;
  cycleIndex: number;
  totalPendingUsdCents: string;
  totalPendingUsdMantissa: string;
  totalCurrentCycleUsdCents: string;
  totalCurrentCycleUsdMantissa: string;
  rewards: PrimeUserPendingRewardResponse[];
}

export const getPrimeUserPendingRewards = async ({
  chainId,
  accountAddress,
}: GetPrimeUserPendingRewardsInput): Promise<GetPrimeUserPendingRewardsOutput> => {
  const response = await restService<GetPrimeUserPendingRewardsResponse>({
    endpoint: `/prime/users/${accountAddress}/pending-rewards`,
    method: 'GET',
    params: { chainId },
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return {
    blockNumber: payload.blockNumber,
    isPrimeHolder: payload.isPrimeHolder,
    rank: payload.rank,
    totalCurrentCycleUsdMantissa: payload.totalCurrentCycleUsdMantissa,
    rewards: payload.rewards.map(reward => ({
      marketAddress: reward.marketAddress,
      rewardTokenAddress: reward.rewardTokenAddress,
      currentCycleUsdMantissa: reward.currentCycleUsdMantissa,
    })),
  };
};

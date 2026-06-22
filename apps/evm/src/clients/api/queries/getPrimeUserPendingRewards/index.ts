import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface PrimeUserPendingReward {
  marketAddress: Address;
  rewardTokenAddress: Address;
  pendingAmountMantissa: string;
  pendingCents: string;
}

export interface GetPrimeUserPendingRewardsInput {
  chainId: ChainId;
  accountAddress: Address;
}

export interface GetPrimeUserPendingRewardsOutput {
  blockNumber: string | null;
  isPrimeHolder: boolean;
  rank: number | null;
  totalPendingCents: string;
  rewards: PrimeUserPendingReward[];
}

interface PrimeUserPendingRewardResponse {
  marketAddress: Address;
  rewardTokenAddress: Address;
  pendingAmountMantissa: string;
  pendingUsdCents: string;
}

interface GetPrimeUserPendingRewardsResponse {
  blockNumber: string | null;
  isPrimeHolder: boolean;
  rank: number | null;
  totalPendingUsdCents: string;
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
    totalPendingCents: payload.totalPendingUsdCents,
    rewards: payload.rewards.map(({ pendingUsdCents, ...reward }) => ({
      ...reward,
      pendingCents: pendingUsdCents,
    })),
  };
};

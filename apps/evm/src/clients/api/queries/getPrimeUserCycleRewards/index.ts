import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface PrimeUserCycleRewardMarket {
  marketAddress: Address;
  rewardTokenAddress: Address;
  totalRewardUsdMantissa: string;
}

export interface GetPrimeUserCycleRewardsInput {
  chainId: ChainId;
  cycleIndex: number;
  accountAddress: Address;
}

export interface GetPrimeUserCycleRewardsOutput {
  rank: number | null;
  effectiveStakeMantissa: string | null;
  totalRewardUsdMantissa: string | null;
  markets: PrimeUserCycleRewardMarket[];
}

interface PrimeUserCycleRewardMarketResponse {
  marketAddress: Address;
  rewardTokenAddress: Address;
  totalRewardMantissa: string;
  totalRewardUsdCents: string;
  totalRewardUsdMantissa: string;
}

interface GetPrimeUserCycleRewardsResponse {
  chainId: string;
  cycleIndex: number;
  userAddress: Address;
  rank: number | null;
  effectiveStakeMantissa: string | null;
  totalRewardUsdCents: string | null;
  totalRewardUsdMantissa: string | null;
  markets: PrimeUserCycleRewardMarketResponse[];
}

export const getPrimeUserCycleRewards = async ({
  chainId,
  cycleIndex,
  accountAddress,
}: GetPrimeUserCycleRewardsInput): Promise<GetPrimeUserCycleRewardsOutput> => {
  const response = await restService<GetPrimeUserCycleRewardsResponse>({
    endpoint: `/prime/cycles/${cycleIndex}/users/${accountAddress}`,
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
    rank: payload.rank,
    effectiveStakeMantissa: payload.effectiveStakeMantissa,
    totalRewardUsdMantissa: payload.totalRewardUsdMantissa,
    markets: payload.markets.map(market => ({
      marketAddress: market.marketAddress,
      rewardTokenAddress: market.rewardTokenAddress,
      totalRewardUsdMantissa: market.totalRewardUsdMantissa,
    })),
  };
};

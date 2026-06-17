import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface PrimeUserCycleRewardMarket {
  marketAddress: Address;
  rewardTokenAddress: Address;
  totalRewardMantissa: string;
  totalRewardUsdCents: string;
}

export interface GetPrimeUserCycleRewardsInput {
  chainId: ChainId;
  cycleIndex: number;
  accountAddress: Address;
}

export interface GetPrimeUserCycleRewardsOutput {
  totalRewardUsdCents: string | null;
  markets: PrimeUserCycleRewardMarket[];
}

export const getPrimeUserCycleRewards = async ({
  chainId,
  cycleIndex,
  accountAddress,
}: GetPrimeUserCycleRewardsInput): Promise<GetPrimeUserCycleRewardsOutput> => {
  const response = await restService<GetPrimeUserCycleRewardsOutput>({
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

  return payload;
};

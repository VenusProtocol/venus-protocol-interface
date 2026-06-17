import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface PrimeUserPendingReward {
  marketAddress: Address;
  rewardTokenAddress: Address;
  pendingAmountMantissa: string;
  pendingUsdCents: string;
}

export interface GetPrimeUserPendingRewardsInput {
  chainId: ChainId;
  accountAddress: Address;
}

export interface GetPrimeUserPendingRewardsOutput {
  blockNumber: string | null;
  isPrimeHolder: boolean;
  rank: number | null;
  totalPendingUsdCents: string;
  rewards: PrimeUserPendingReward[];
}

export const getPrimeUserPendingRewards = async ({
  chainId,
  accountAddress,
}: GetPrimeUserPendingRewardsInput): Promise<GetPrimeUserPendingRewardsOutput> => {
  const response = await restService<GetPrimeUserPendingRewardsOutput>({
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

  return payload;
};

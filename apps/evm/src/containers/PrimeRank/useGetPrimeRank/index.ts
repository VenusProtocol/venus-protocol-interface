import BigNumber from 'bignumber.js';

import {
  useGetPrimeEffectiveStake,
  useGetPrimeMinimumStake,
  useGetPrimeUserPendingRewards,
} from 'clients/api';
import { PRIME_RANK_LIMIT } from 'constants/prime';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { convertMantissaToTokens } from 'utilities';

export interface PrimeRankData {
  hasStakedXvs: boolean;
  isCandidate: boolean;
  rank: number;
  primeScore: number;
  gapXvsTokens: number;
}

export const useGetPrimeRank = (): PrimeRankData & { isLoading: boolean } => {
  const { accountAddress } = useAccountAddress();
  const xvs = useGetToken({ symbol: 'XVS' });

  const { data: userPendingRewards, isLoading: isUserPendingRewardsLoading } =
    useGetPrimeUserPendingRewards({ accountAddress });
  const { data: effectiveStake, isLoading: isEffectiveStakeLoading } = useGetPrimeEffectiveStake({
    accountAddress,
  });
  const { data: minimumStake, isLoading: isMinimumStakeLoading } = useGetPrimeMinimumStake();

  const stakedTokens = convertMantissaToTokens({
    value: effectiveStake?.totalStakedMantissa ?? new BigNumber(0),
    token: xvs,
  });
  const hasStakedXvs = !!stakedTokens?.isGreaterThan(0);

  const rank = userPendingRewards?.rank ?? 0;
  const isCandidate =
    hasStakedXvs && rank > 0 && rank <= (minimumStake?.tokenLimit ?? PRIME_RANK_LIMIT);

  const primeScore =
    convertMantissaToTokens({
      value: effectiveStake?.effectiveStakeMantissa ?? new BigNumber(0),
      token: xvs,
    })?.toNumber() ?? 0;

  const bottomStakeTokens =
    minimumStake?.reason === 'last_position'
      ? convertMantissaToTokens({
          value: new BigNumber(minimumStake.minimumStakeMantissa ?? 0),
          token: xvs,
        })
      : undefined;
  const gapXvsTokens = bottomStakeTokens
    ? BigNumber.maximum(bottomStakeTokens.minus(stakedTokens ?? 0).plus(1), 0).toNumber()
    : 0;

  return {
    isLoading: isUserPendingRewardsLoading || isEffectiveStakeLoading || isMinimumStakeLoading,
    hasStakedXvs,
    isCandidate,
    rank,
    primeScore,
    gapXvsTokens,
  };
};

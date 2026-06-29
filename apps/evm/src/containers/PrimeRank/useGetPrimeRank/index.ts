import BigNumber from 'bignumber.js';

import {
  useGetPrimeCurrentCycle,
  useGetPrimeDeposits,
  useGetPrimeEffectiveStake,
  useGetPrimeMinimumStake,
  useGetPrimeMultiplierTiers,
  useGetPrimeTokenLimit,
  useGetPrimeUserPendingRewards,
} from 'clients/api';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { convertMantissaToTokens } from 'utilities';

import { calculateStakeToReachTop } from '../calculateStakeToReachTop';

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
  const { data: tokenLimitData, isLoading: isTokenLimitLoading } = useGetPrimeTokenLimit();
  const { data: currentCycle } = useGetPrimeCurrentCycle();
  const { data: multiplierTiers } = useGetPrimeMultiplierTiers();
  const { data: userDeposits } = useGetPrimeDeposits({ accountAddress });
  const { data: targetDeposits } = useGetPrimeDeposits({
    accountAddress: minimumStake?.lastPrimeHolderAddress ?? undefined,
  });

  const stakedTokens = convertMantissaToTokens({
    value: effectiveStake?.totalStakedMantissa ?? new BigNumber(0),
    token: xvs,
  });
  const hasStakedXvs = !!stakedTokens?.isGreaterThan(0);

  const rank = userPendingRewards?.rank ?? 0;
  const rankLimit = minimumStake?.tokenLimit ?? tokenLimitData?.tokenLimit;
  const isCandidate = hasStakedXvs && rank > 0 && rankLimit !== undefined && rank <= rankLimit;

  const primeScore =
    convertMantissaToTokens({
      value: effectiveStake?.effectiveStakeMantissa ?? new BigNumber(0),
      token: xvs,
    })?.toNumber() ?? 0;

  let gapXvsTokens = 0;
  if (currentCycle?.cycle && multiplierTiers && userDeposits && targetDeposits) {
    gapXvsTokens = calculateStakeToReachTop({
      userDeposits: userDeposits.deposits,
      targetDeposits: targetDeposits.deposits,
      tiers: multiplierTiers.tiers,
      cycleEndsAt: currentCycle.cycle.endsAt,
      now: new Date(),
    });
  }

  return {
    isLoading:
      isUserPendingRewardsLoading ||
      isEffectiveStakeLoading ||
      isMinimumStakeLoading ||
      isTokenLimitLoading,
    hasStakedXvs,
    isCandidate,
    rank,
    primeScore,
    gapXvsTokens,
  };
};

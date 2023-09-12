import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { Token } from 'types';

import { MainPoolPendingRewardGroup } from '../types';
import formatRewardSummaryData from './formatRewardSummaryData';

function formatToMainPoolPendingRewardGroup({
  comptrollerContractAddress,
  venusLensPendingRewardsResult,
  rewardTokenPriceMapping,
  tokens,
}: {
  comptrollerContractAddress: string;
  venusLensPendingRewardsResult: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'venusLens'>['pendingRewards']> | undefined>
  >;
  rewardTokenPriceMapping: Record<string, BigNumber>;
  tokens: Token[];
}) {
  if (venusLensPendingRewardsResult.status === 'rejected' || !venusLensPendingRewardsResult.value) {
    return;
  }

  const rewardSummaryData = formatRewardSummaryData({
    rewardSummary: venusLensPendingRewardsResult.value,
    rewardTokenPriceMapping,
    tokens,
  });

  if (!rewardSummaryData) {
    return;
  }

  const { rewardToken, rewardAmountWei, rewardAmountCents, vTokenAddressesWithPendingReward } =
    rewardSummaryData;

  const pendingRewardGroup: MainPoolPendingRewardGroup = {
    type: 'mainPool',
    comptrollerAddress: comptrollerContractAddress,
    rewardToken,
    rewardAmountCents,
    rewardAmountWei,
    vTokenAddressesWithPendingReward,
  };

  return pendingRewardGroup;
}

export default formatToMainPoolPendingRewardGroup;

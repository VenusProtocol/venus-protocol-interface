import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { Token } from 'types';

import { MainPoolPendingRewardGroup } from '../types';
import formatRewardSummaryData from './formatRewardSummaryData';

function formatToMainPoolPendingRewardGroup({
  comptrollerContractAddress,
  venusLensPendingRewards,
  tokenPriceMapping,
  tokens,
}: {
  comptrollerContractAddress: string;
  tokenPriceMapping: Record<string, BigNumber>;
  tokens: Token[];
  venusLensPendingRewards: Awaited<ReturnType<ContractTypeByName<'venusLens'>['pendingRewards']>>;
}) {
  const rewardSummaryData = formatRewardSummaryData({
    rewardSummary: venusLensPendingRewards,
    tokenPriceMapping,
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

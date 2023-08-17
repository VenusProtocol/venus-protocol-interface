import BigNumber from 'bignumber.js';
import { ContractCallReturnContext } from 'ethereum-multicall';

import { MainPoolPendingRewardGroup } from '../types';
import formatRewardSummaryData, { RewardSummary } from './formatRewardSummaryData';

function formatToMainPoolPendingRewardGroup({
  callsReturnContext,
  rewardTokenPrices,
}: {
  callsReturnContext: ContractCallReturnContext['callsReturnContext'][number];
  rewardTokenPrices: Record<string, BigNumber>;
}) {
  const { returnValues, methodParameters } = callsReturnContext;

  if (returnValues.length === 0) {
    return;
  }

  const rewardSummaryData = formatRewardSummaryData({
    rewardSummary: returnValues as RewardSummary,
    rewardTokenPrices,
  });

  if (!rewardSummaryData) {
    return;
  }

  const { rewardToken, rewardAmountWei, rewardAmountCents, vTokenAddressesWithPendingReward } =
    rewardSummaryData;

  const pendingRewardGroup: MainPoolPendingRewardGroup = {
    type: 'mainPool',
    comptrollerAddress: methodParameters[1],
    rewardToken,
    rewardAmountCents,
    rewardAmountWei,
    vTokenAddressesWithPendingReward,
  };

  return pendingRewardGroup;
}

export default formatToMainPoolPendingRewardGroup;

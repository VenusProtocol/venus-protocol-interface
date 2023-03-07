import { ContractCallReturnContext } from 'ethereum-multicall';

import { MainPoolPendingRewardGroup } from '../types';
import formatRewardSummaryData, { RewardSummary } from './formatRewardSummaryData';

function formatToMainPoolPendingRewardGroup(
  callsReturnContext: ContractCallReturnContext['callsReturnContext'][number],
) {
  const { returnValues, methodParameters } = callsReturnContext;

  const rewardSummaryData = formatRewardSummaryData(returnValues as RewardSummary);

  if (!rewardSummaryData) {
    return;
  }

  const pendingRewardGroup: MainPoolPendingRewardGroup = {
    type: 'mainPool',
    comptrollerAddress: methodParameters[1],
    rewardToken: rewardSummaryData.rewardToken,
    rewardAmountWei: rewardSummaryData.rewardAmountWei,
    vTokenAddressesWithPendingReward: rewardSummaryData.vTokenAddressesWithPendingReward,
  };

  return pendingRewardGroup;
}

export default formatToMainPoolPendingRewardGroup;

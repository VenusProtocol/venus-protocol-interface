import { ContractCallReturnContext } from 'ethereum-multicall';
import { formatTokenPrices } from 'utilities';

import { IsolatedPoolPendingReward, IsolatedPoolPendingRewardGroup } from '../types';
import formatRewardSummaryData from './formatRewardSummaryData';

function formatToPoolPendingRewardGroup(
  callsReturnContext: ContractCallReturnContext['callsReturnContext'][number],
  rewardTokenPrices: ReturnType<typeof formatTokenPrices>,
) {
  const { returnValues, methodParameters } = callsReturnContext;

  if (returnValues.length === 0) {
    return;
  }

  const pendingRewards: IsolatedPoolPendingReward[] = returnValues
    .map(rewardSummary => formatRewardSummaryData({ rewardSummary, rewardTokenPrices }))
    .filter((pendingReward): pendingReward is IsolatedPoolPendingReward => !!pendingReward);

  if (pendingRewards.length === 0) {
    return;
  }

  const pendingRewardGroup: IsolatedPoolPendingRewardGroup = {
    type: 'isolatedPool',
    comptrollerAddress: methodParameters[1],
    pendingRewards,
  };

  return pendingRewardGroup;
}

export default formatToPoolPendingRewardGroup;

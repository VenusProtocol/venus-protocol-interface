import { ContractCallReturnContext } from 'ethereum-multicall';

import { IsolatedPoolPendingReward, IsolatedPoolPendingRewardGroup } from '../types';
import formatRewardSummaryData from './formatRewardSummaryData';

function formatToPoolPendingRewardGroup(
  callsReturnContext: ContractCallReturnContext['callsReturnContext'][number],
) {
  const { returnValues, methodParameters } = callsReturnContext;

  const pendingRewards: IsolatedPoolPendingReward[] = returnValues
    .map(formatRewardSummaryData)
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

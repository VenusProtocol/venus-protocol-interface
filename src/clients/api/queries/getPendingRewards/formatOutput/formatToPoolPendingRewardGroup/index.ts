import { ContractCallReturnContext } from 'ethereum-multicall';

import { PoolPendingRewardGroup } from '../../types';
import formatToPoolPendingReward from './formatToPoolPendingRewards';

interface FormatToPoolPendingRewardsGroupsInput {
  callsReturnContext: ContractCallReturnContext['callsReturnContext'][number];
}

const formatToPoolPendingRewardGroup = ({
  callsReturnContext,
}: FormatToPoolPendingRewardsGroupsInput): PoolPendingRewardGroup | undefined => {
  const { returnValues, methodParameters } = callsReturnContext;

  const pendingRewards = formatToPoolPendingReward({
    rewardSummaries:
      // Check if returnValues is just one RewardSummary (which is the case
      // for the main pool) or an array of RewardSummary instances (which is
      // the case for isolated pools)
      returnValues.length > 0 && typeof returnValues[0] !== 'object'
        ? [returnValues]
        : returnValues,
  });

  if (pendingRewards.length === 0) {
    return undefined;
  }

  return {
    type: 'pool',
    comptrollerAddress: methodParameters[1],
    pendingRewards,
  };
};

export default formatToPoolPendingRewardGroup;

import { ContractCallReturnContext } from 'ethereum-multicall';

import {
  IsolatedPoolPendingReward,
  IsolatedPoolPendingRewardGroup,
  MainPoolPendingReward,
  MainPoolPendingRewardGroup,
} from '../../types';
import formatToPoolPendingReward from './formatToPoolPendingRewards';

function formatToPoolPendingRewardGroup<T extends 'mainPool' | 'isolatedPool'>({
  callsReturnContext,
  type,
}: {
  type: T;
  callsReturnContext: ContractCallReturnContext['callsReturnContext'][number];
}): IsolatedPoolPendingRewardGroup | MainPoolPendingRewardGroup | undefined {
  const { returnValues, methodParameters } = callsReturnContext;

  const pendingRewards = formatToPoolPendingReward({
    type,
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

  if (type === 'mainPool') {
    return {
      type: 'mainPool',
      comptrollerAddress: methodParameters[1],
      pendingRewards: pendingRewards as MainPoolPendingReward[],
    };
  }

  return {
    type: 'isolatedPool',
    comptrollerAddress: methodParameters[1],
    pendingRewards: pendingRewards as IsolatedPoolPendingReward[],
  };
}

export default formatToPoolPendingRewardGroup;

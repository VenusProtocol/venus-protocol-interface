import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { Token } from 'types';

import { IsolatedPoolPendingReward, IsolatedPoolPendingRewardGroup } from '../types';
import formatRewardSummaryData from './formatRewardSummaryData';

function formatToPoolPendingRewardGroup({
  comptrollerContractAddress,
  rewardSummaries,
  tokenPriceMapping,
  tokens,
}: {
  comptrollerContractAddress: string;
  rewardSummaries: Awaited<ReturnType<ContractTypeByName<'poolLens'>['getPendingRewards']>>;
  tokenPriceMapping: Record<string, BigNumber>;
  tokens: Token[];
}) {
  const pendingRewards: IsolatedPoolPendingReward[] = rewardSummaries
    .map(rewardSummary => formatRewardSummaryData({ rewardSummary, tokenPriceMapping, tokens }))
    .filter((pendingReward): pendingReward is IsolatedPoolPendingReward => !!pendingReward);

  if (pendingRewards.length === 0) {
    return;
  }

  const pendingRewardGroup: IsolatedPoolPendingRewardGroup = {
    type: 'isolatedPool',
    comptrollerAddress: comptrollerContractAddress,
    pendingRewards,
  };

  return pendingRewardGroup;
}

export default formatToPoolPendingRewardGroup;

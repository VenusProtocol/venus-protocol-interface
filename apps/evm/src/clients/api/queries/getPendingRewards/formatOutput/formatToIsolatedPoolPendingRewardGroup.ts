import type BigNumber from 'bignumber.js';
import type { Token } from 'types';

import type { Address } from 'viem';
import type {
  IsolatedPoolPendingReward,
  IsolatedPoolPendingRewardGroup,
  PendingInternalRewardSummary,
} from '../types';
import formatRewardSummaryData from './formatRewardSummaryData';

function formatToPoolPendingRewardGroup({
  comptrollerContractAddress,
  rewardSummaries,
  tokenPriceMapping,
  tokens,
}: {
  comptrollerContractAddress: Address;
  rewardSummaries: PendingInternalRewardSummary[];
  tokenPriceMapping: Record<Address, BigNumber>;
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

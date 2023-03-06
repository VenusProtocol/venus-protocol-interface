import BigNumber from 'bignumber.js';
import { ContractCallReturnContext } from 'ethereum-multicall';
import { getTokenByAddress } from 'utilities';

import { IsolatedPoolPendingReward, MainPoolPendingReward } from '../../types';

type FormatToPoolPendingRewardsOutput<T extends 'mainPool' | 'isolatedPool'> = T extends 'mainPool'
  ? MainPoolPendingReward[]
  : IsolatedPoolPendingReward[];

function formatToPoolPendingRewards<T extends 'mainPool' | 'isolatedPool'>({
  type,
  rewardSummaries,
}: {
  type: T;
  rewardSummaries: ContractCallReturnContext['callsReturnContext'][number]['returnValues'];
}): FormatToPoolPendingRewardsOutput<T> {
  const pendingRewards = rewardSummaries
    .map(rewardSummary => {
      const rewardToken = getTokenByAddress(rewardSummary[1]);

      // Filter out result if no corresponding token is found
      if (!rewardToken) {
        return undefined;
      }

      const vTokenAddressesWithPendingReward: string[] = [];
      const distributedRewardsWei = new BigNumber(rewardSummary[2].hex);

      // Go through markets to aggregate rewards
      const markets: [
        string, // vToken address
        { hex: string }, // Pending reward
      ][] = rewardSummary[3];

      const rewardAmountWei = markets.reduce((acc, market) => {
        const vTokenPendingReward = new BigNumber(market[1].hex);
        // Filter out vToken if it doesn't have any pending reward to collect
        if (vTokenPendingReward.isEqualTo(0)) {
          return acc;
        }

        // Add vToken address to the list of addresses that rewards need to be
        // collected from
        vTokenAddressesWithPendingReward.push(market[0]);

        return acc.plus(vTokenPendingReward);
      }, distributedRewardsWei);

      // Return undefined if there's no pending reward
      if (rewardAmountWei.isEqualTo(0)) {
        return;
      }

      const pendingRewardBase = {
        rewardToken,
        rewardAmountWei,
        vTokenAddressesWithPendingReward,
      };

      if (type === 'mainPool') {
        const pendingReward: MainPoolPendingReward = pendingRewardBase;
        return pendingReward;
      }

      const pendingReward: IsolatedPoolPendingReward = {
        ...pendingRewardBase,
        rewardsDistributorAddress: rewardSummary[0],
      };

      return pendingReward;
    })
    .filter(pendingReward => !!pendingReward) as T extends 'mainPool'
    ? MainPoolPendingReward[]
    : IsolatedPoolPendingReward[];

  return pendingRewards;
}

export default formatToPoolPendingRewards;

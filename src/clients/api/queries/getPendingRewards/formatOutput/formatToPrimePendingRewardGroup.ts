import BigNumber from 'bignumber.js';
import { logError } from 'errors';
import { Prime } from 'packages/contracts';
import { Token } from 'types';
import { convertDollarsToCents, convertWeiToTokens, findTokenByAddress } from 'utilities';

import { PrimePendingReward, PrimePendingRewardGroup } from '../types';

const formatToPrimePendingRewardGroup = ({
  primePendingRewards,
  tokenPriceMapping,
  tokens,
}: {
  primePendingRewards: Awaited<ReturnType<Prime['callStatic']['getPendingRewards']>>;
  tokenPriceMapping: Record<string, BigNumber>;
  tokens: Token[];
}) => {
  const vTokenAddressesWithPendingReward: string[] = [];

  const pendingRewards = primePendingRewards.reduce<PrimePendingReward[]>(
    (acc, primePendingReward) => {
      const rewardToken = findTokenByAddress({
        address: primePendingReward.rewardToken,
        tokens,
      });

      // Filter out result if no corresponding token is found
      if (!rewardToken) {
        logError(`Record missing for reward token: ${primePendingReward.rewardToken}`);
        return acc;
      }

      const rewardTokenPriceDollars = tokenPriceMapping[rewardToken.address.toLowerCase()];

      // Return if there is no available reward token price
      if (!rewardTokenPriceDollars) {
        logError(`Could not fetch price for token: ${rewardToken.address}`);
        return acc;
      }

      // Add vToken address to list of vTokens to collect rewards from
      vTokenAddressesWithPendingReward.push(primePendingReward.vToken);

      const rewardAmountWei = new BigNumber(primePendingReward.amount.toString());
      const rewardAmountTokens = convertWeiToTokens({
        valueWei: new BigNumber(primePendingReward.amount.toString()),
        token: rewardToken,
      });

      const rewardTokenPriceCents = convertDollarsToCents(rewardTokenPriceDollars);
      const rewardAmountCents = rewardAmountTokens.multipliedBy(rewardTokenPriceCents);

      const pendingReward: PrimePendingReward = {
        rewardToken,
        rewardAmountWei,
        rewardAmountCents,
      };

      return [...acc, pendingReward];
    },
    [],
  );

  const primePendingRewardGroup: PrimePendingRewardGroup = {
    type: 'prime',
    vTokenAddressesWithPendingReward,
    pendingRewards,
  };

  return primePendingRewardGroup;
};

export default formatToPrimePendingRewardGroup;

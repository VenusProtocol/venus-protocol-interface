import BigNumber from 'bignumber.js';
import { logError } from 'errors';
import { Prime } from 'packages/contracts';
import { Token } from 'types';
import { convertDollarsToCents, convertWeiToTokens, findTokenByAddress } from 'utilities';

import { PrimePendingReward, PrimePendingRewardGroup } from '../types';

const formatToPrimePendingRewardGroup = ({
  isPrimeContractPaused,
  primePendingRewards,
  tokenPriceMapping,
  tokens,
}: {
  isPrimeContractPaused: boolean;
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

      const rewardAmountWei = new BigNumber(primePendingReward.amount.toString());

      // Skip if pending reward amount is 0
      if (rewardAmountWei.isLessThanOrEqualTo(0)) {
        return acc;
      }

      // Add vToken address to list of vTokens to collect rewards from
      vTokenAddressesWithPendingReward.push(primePendingReward.vToken);

      const rewardAmountTokens = convertWeiToTokens({
        value: new BigNumber(primePendingReward.amount.toString()),
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

  if (pendingRewards.length === 0) {
    return undefined;
  }

  const primePendingRewardGroup: PrimePendingRewardGroup = {
    type: 'prime',
    isDisabled: isPrimeContractPaused,
    vTokenAddressesWithPendingReward,
    pendingRewards,
  };

  return primePendingRewardGroup;
};

export default formatToPrimePendingRewardGroup;

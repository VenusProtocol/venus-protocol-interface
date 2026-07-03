import BigNumber from 'bignumber.js';

import type { PrimeVersion, Token } from 'types';
import { convertDollarsToCents, convertMantissaToTokens, findTokenByAddress } from 'utilities';

import type { Address } from 'viem';
import type { PrimePendingReward, PrimePendingRewardGroup } from '../types';

// V1 and V2 Prime contracts return the same getPendingRewards shape, so this formatter handles both
const formatToPrimePendingRewardGroup = ({
  primeVersion,
  isPrimeContractPaused,
  primePendingRewards,
  tokenPriceMapping,
  tokens,
}: {
  primeVersion: PrimeVersion;
  isPrimeContractPaused: boolean;
  primePendingRewards: readonly { rewardToken: Address; vToken: Address; amount: bigint }[];
  tokenPriceMapping: Record<string, BigNumber>;
  tokens: Token[];
}) => {
  const vTokenAddressesWithPendingReward: Address[] = [];

  const pendingRewards = primePendingRewards.reduce<PrimePendingReward[]>(
    (acc, primePendingReward) => {
      const rewardToken = findTokenByAddress({
        address: primePendingReward.rewardToken,
        tokens,
      });

      // Filter out result if no corresponding token is found
      if (!rewardToken) {
        return acc;
      }

      const rewardTokenPriceDollars = tokenPriceMapping[rewardToken.address.toLowerCase()];

      // Return if there is no available reward token price
      if (!rewardTokenPriceDollars) {
        return acc;
      }

      const rewardAmountMantissa = new BigNumber(primePendingReward.amount.toString());

      // Skip if pending reward amount is 0
      if (rewardAmountMantissa.isLessThanOrEqualTo(0)) {
        return acc;
      }

      // Add vToken address to list of vTokens to collect rewards from
      vTokenAddressesWithPendingReward.push(primePendingReward.vToken);

      const rewardAmountTokens = convertMantissaToTokens({
        value: new BigNumber(primePendingReward.amount.toString()),
        token: rewardToken,
      });

      const rewardTokenPriceCents = convertDollarsToCents(rewardTokenPriceDollars);
      const rewardAmountCents = rewardAmountTokens.multipliedBy(rewardTokenPriceCents);

      const pendingReward: PrimePendingReward = {
        rewardToken,
        rewardAmountMantissa,
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
    primeVersion,
    isDisabled: isPrimeContractPaused,
    vTokenAddressesWithPendingReward,
    pendingRewards,
  };

  return primePendingRewardGroup;
};

export default formatToPrimePendingRewardGroup;

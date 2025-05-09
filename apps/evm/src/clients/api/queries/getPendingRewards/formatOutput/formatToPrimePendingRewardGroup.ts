import BigNumber from 'bignumber.js';

import type { Token } from 'types';
import { convertDollarsToCents, convertMantissaToTokens, findTokenByAddress } from 'utilities';

import type { primeAbi } from 'libs/contracts';
import type { Address, ContractFunctionArgs, SimulateContractReturnType } from 'viem';
import type { PrimePendingReward, PrimePendingRewardGroup } from '../types';

const formatToPrimePendingRewardGroup = ({
  isPrimeContractPaused,
  primePendingRewards,
  tokenPriceMapping,
  tokens,
}: {
  isPrimeContractPaused: boolean;
  primePendingRewards: SimulateContractReturnType<
    typeof primeAbi,
    'getPendingRewards',
    ContractFunctionArgs<typeof primeAbi, 'nonpayable' | 'payable', 'getPendingRewards'>
  >['result'];
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
    isDisabled: isPrimeContractPaused,
    vTokenAddressesWithPendingReward,
    pendingRewards,
  };

  return primePendingRewardGroup;
};

export default formatToPrimePendingRewardGroup;

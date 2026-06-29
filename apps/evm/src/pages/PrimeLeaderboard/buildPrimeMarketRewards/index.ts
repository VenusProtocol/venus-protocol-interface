import type BigNumber from 'bignumber.js';

import type { Asset, Token } from 'types';
import { findTokenByAddress } from 'utilities';
import type { Address } from 'viem';

import type { UserMarketReward } from '../UserRewardsCard';
import { calculatePrimeRewardCents } from '../calculatePrimeRewardCents';

export interface PrimeRewardEntry {
  marketAddress: Address;
  amountMantissa: BigNumber.Value;
  fallbackCents: number;
}

export interface PrimeRewardGroup {
  rewardTokenAddress: Address;
  marketAddress?: Address;
  entries: PrimeRewardEntry[];
}

export interface BuildPrimeMarketRewardsInput {
  groups: PrimeRewardGroup[];
  assets: Asset[];
  tokens: Token[];
}

export const buildPrimeMarketRewards = ({
  groups,
  assets,
  tokens,
}: BuildPrimeMarketRewardsInput): UserMarketReward[] =>
  groups.flatMap(({ rewardTokenAddress, marketAddress, entries }) => {
    const token = findTokenByAddress({ address: rewardTokenAddress, tokens });
    if (!token || !marketAddress) {
      return [];
    }

    const rewardsCents = entries.reduce(
      (total, entry) =>
        total +
        calculatePrimeRewardCents({
          amountMantissa: entry.amountMantissa,
          marketAddress: entry.marketAddress,
          token,
          assets,
          fallbackCents: entry.fallbackCents,
        }),
      0,
    );

    return [{ token, marketAddress, rewardsCents }];
  });

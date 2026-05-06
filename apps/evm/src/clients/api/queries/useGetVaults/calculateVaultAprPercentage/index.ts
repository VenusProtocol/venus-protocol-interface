import type BigNumber from 'bignumber.js';

import { DAYS_PER_YEAR } from 'constants/time';
import type { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

export interface CalculateVaultAprPercentageInput {
  dailyEmissionMantissa: BigNumber;
  rewardToken: Token;
  rewardTokenPriceCents: BigNumber;
  stakeBalanceMantissa: BigNumber;
  stakedToken: Token;
  stakedTokenPriceCents: BigNumber;
}

export const calculateVaultAprPercentage = ({
  dailyEmissionMantissa,
  rewardToken,
  rewardTokenPriceCents,
  stakeBalanceMantissa,
  stakedToken,
  stakedTokenPriceCents,
}: CalculateVaultAprPercentageInput): number => {
  const dailyEmissionTokens = convertMantissaToTokens({
    value: dailyEmissionMantissa,
    token: rewardToken,
  });

  const stakeBalanceTokens = convertMantissaToTokens({
    value: stakeBalanceMantissa,
    token: stakedToken,
  });

  if (stakeBalanceTokens.lte(0)) {
    return 0;
  }

  return dailyEmissionTokens
    .multipliedBy(rewardTokenPriceCents)
    .multipliedBy(DAYS_PER_YEAR)
    .multipliedBy(100)
    .dividedBy(stakeBalanceTokens.multipliedBy(stakedTokenPriceCents))
    .toNumber();
};

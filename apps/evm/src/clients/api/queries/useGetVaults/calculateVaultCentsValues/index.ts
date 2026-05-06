import type BigNumber from 'bignumber.js';

import { convertPriceMantissaToDollars } from 'utilities';

export const calculateVaultCentsValues = ({
  stakedTokenDecimals,
  rewardTokenDecimals,
  stakedTokenPriceCents,
  rewardTokenPriceCents,
  stakeBalanceMantissa,
  userStakeBalanceMantissa,
  dailyEmissionMantissa,
}: {
  stakedTokenDecimals: number;
  rewardTokenDecimals: number;
  stakedTokenPriceCents: BigNumber;
  rewardTokenPriceCents: BigNumber;
  stakeBalanceMantissa: BigNumber;
  userStakeBalanceMantissa?: BigNumber;
  dailyEmissionMantissa?: BigNumber;
}) => ({
  stakeBalanceCents: convertPriceMantissaToDollars({
    priceMantissa: stakeBalanceMantissa.times(stakedTokenPriceCents),
    decimals: stakedTokenDecimals,
  }).toNumber(),
  userStakeBalanceCents:
    userStakeBalanceMantissa !== undefined
      ? convertPriceMantissaToDollars({
          priceMantissa: userStakeBalanceMantissa.times(stakedTokenPriceCents),
          decimals: stakedTokenDecimals,
        }).toNumber()
      : undefined,
  dailyEmissionCents:
    dailyEmissionMantissa !== undefined
      ? convertPriceMantissaToDollars({
          priceMantissa: dailyEmissionMantissa.times(rewardTokenPriceCents),
          decimals: rewardTokenDecimals,
        }).toNumber()
      : undefined,
});

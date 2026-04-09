import type BigNumber from 'bignumber.js';

import { convertPriceMantissaToDollars } from 'utilities';

export const calculateVaultCentsValues = ({
  stakedTokenDecimals,
  rewardTokenDecimals,
  stakedTokenPriceCents,
  rewardTokenPriceCents,
  totalStakedMantissa,
  userStakedMantissa,
  dailyEmissionMantissa,
}: {
  stakedTokenDecimals: number;
  rewardTokenDecimals: number;
  stakedTokenPriceCents: BigNumber;
  rewardTokenPriceCents: BigNumber;
  totalStakedMantissa: BigNumber;
  userStakedMantissa?: BigNumber;
  dailyEmissionMantissa?: BigNumber;
}) => ({
  totalStakedCents: convertPriceMantissaToDollars({
    priceMantissa: totalStakedMantissa.times(stakedTokenPriceCents),
    decimals: stakedTokenDecimals,
  }).toNumber(),
  userStakedCents:
    userStakedMantissa !== undefined
      ? convertPriceMantissaToDollars({
          priceMantissa: userStakedMantissa.times(stakedTokenPriceCents),
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

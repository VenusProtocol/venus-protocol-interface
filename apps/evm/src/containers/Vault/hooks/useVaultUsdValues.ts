import { useGetTokenUsdPrice } from 'clients/api';
import type { Vault } from 'types';
import { convertPriceMantissaToDollars } from 'utilities';

export const useVaultUsdValues = (vault: Vault) => {
  const {
    stakedToken,
    rewardToken,
    userStakedMantissa,
    totalStakedMantissa,
    dailyEmissionMantissa,
  } = vault;

  const { data: stakedTokenPrice, isFetching: isStakedTokenPriceFetching } = useGetTokenUsdPrice({
    token: stakedToken,
  });

  const { data: rewardTokenPrice, isFetching: isRewardTokenPriceFetching } = useGetTokenUsdPrice({
    token: rewardToken,
  });

  return {
    isLoading: isStakedTokenPriceFetching || isRewardTokenPriceFetching,
    data: {
      stakedTokenPriceUsd: stakedTokenPrice?.tokenPriceUsd,
      rewardTokenPriceUsd: rewardTokenPrice?.tokenPriceUsd,
      userStakedUsdCents:
        userStakedMantissa && stakedTokenPrice?.tokenPriceUsd
          ? convertPriceMantissaToDollars({
              priceMantissa: userStakedMantissa?.times(stakedTokenPrice?.tokenPriceUsd),
              decimals: stakedToken.decimals,
            }).shiftedBy(2)
          : undefined,
      totalStakedUsdCents:
        totalStakedMantissa && stakedTokenPrice?.tokenPriceUsd
          ? convertPriceMantissaToDollars({
              priceMantissa: totalStakedMantissa?.times(stakedTokenPrice?.tokenPriceUsd),
              decimals: stakedToken.decimals,
            }).shiftedBy(2)
          : undefined,
      dailyEmissionUsdCents:
        dailyEmissionMantissa && rewardTokenPrice?.tokenPriceUsd
          ? convertPriceMantissaToDollars({
              priceMantissa: dailyEmissionMantissa?.times(rewardTokenPrice?.tokenPriceUsd),
              decimals: rewardToken.decimals,
            }).shiftedBy(2)
          : undefined,
    },
  };
};

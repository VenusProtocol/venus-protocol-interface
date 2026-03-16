import { useGetTokenListUsdPrice } from 'clients/api';
import type { AnyVault } from 'types';
import { convertPriceMantissaToDollars } from 'utilities';

export const useVaultUsdValues = (vault: AnyVault) => {
  const { stakedToken, rewardToken, userStakedMantissa, totalStakedMantissa } = vault;
  const dailyEmissionMantissa =
    'dailyEmissionMantissa' in vault ? vault.dailyEmissionMantissa : undefined;

  const { data: tokenPrices, isLoading: isTokensPriceLoading } = useGetTokenListUsdPrice({
    tokens: [stakedToken, rewardToken],
  });

  const [stakedTokenPrice, rewardTokenPrice] = tokenPrices ?? [];

  return {
    isLoading: isTokensPriceLoading,
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

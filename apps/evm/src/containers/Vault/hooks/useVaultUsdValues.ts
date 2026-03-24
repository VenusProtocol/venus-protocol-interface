import { useGetTokenListUsdPrice } from 'clients/api';
import type { AnyVault } from 'types';
import { convertPriceMantissaToDollars } from 'utilities';

export const useVaultUsdValues = (vault: AnyVault) => {
  const { stakedToken, rewardToken, userStakedMantissa, totalStakedMantissa } = vault;
  const dailyEmissionMantissa =
    'dailyEmissionMantissa' in vault ? vault.dailyEmissionMantissa : undefined;

  const { data: tokenPrices, isLoading: isTokensPriceLoading } = useGetTokenListUsdPrice(
    {
      tokens: [stakedToken, rewardToken],
    },
    {
      enabled: !('stakedTokenPriceUsd' in vault && 'rewardTokenPriceUsd' in vault),
    },
  );

  const [stakedTokenPrice, rewardTokenPrice] = tokenPrices ?? [];
  const stakedTokenPriceUsd =
    'stakedTokenPriceUsd' in vault ? vault.stakedTokenPriceUsd : stakedTokenPrice?.tokenPriceUsd;
  const rewardTokenPriceUsd =
    'rewardTokenPriceUsd' in vault ? vault.rewardTokenPriceUsd : rewardTokenPrice?.tokenPriceUsd;

  return {
    isLoading: isTokensPriceLoading,
    data: {
      stakedTokenPriceUsd,
      rewardTokenPriceUsd,
      userStakedUsdCents:
        userStakedMantissa && stakedTokenPriceUsd
          ? convertPriceMantissaToDollars({
              priceMantissa: userStakedMantissa?.times(stakedTokenPriceUsd),
              decimals: stakedToken.decimals,
            }).shiftedBy(2)
          : undefined,
      totalStakedUsdCents:
        totalStakedMantissa && stakedTokenPriceUsd
          ? convertPriceMantissaToDollars({
              priceMantissa: totalStakedMantissa?.times(stakedTokenPriceUsd),
              decimals: stakedToken.decimals,
            }).shiftedBy(2)
          : undefined,
      dailyEmissionUsdCents:
        dailyEmissionMantissa && rewardTokenPriceUsd
          ? convertPriceMantissaToDollars({
              priceMantissa: dailyEmissionMantissa?.times(rewardTokenPriceUsd),
              decimals: rewardToken.decimals,
            }).shiftedBy(2)
          : undefined,
    },
  };
};

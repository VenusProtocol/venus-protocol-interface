import { useGetTokenListUsdPrice } from 'clients/api';
import type { Vault } from 'types';
import { convertPriceMantissaToDollars, isPendleVault } from 'utilities';

export const useVaultUsdValues = (vault: Vault) => {
  const { stakedToken, rewardToken, userStakedMantissa, totalStakedMantissa } = vault;
  const dailyEmissionMantissa = !isPendleVault(vault) ? vault.dailyEmissionMantissa : undefined;

  const hasPricesFromApi = isPendleVault(vault);

  const { data: tokenPrices, isLoading: isTokensPriceLoading } = useGetTokenListUsdPrice(
    {
      tokens: [stakedToken, rewardToken],
    },
    {
      enabled: !hasPricesFromApi,
    },
  );

  const [stakedTokenPrice, rewardTokenPrice] = tokenPrices ?? [];
  const stakedTokenPriceCents = hasPricesFromApi
    ? vault.stakedTokenPriceCents
    : stakedTokenPrice?.tokenPriceUsd?.shiftedBy(2);
  const rewardTokenPriceCents = hasPricesFromApi
    ? vault.rewardTokenPriceCents
    : rewardTokenPrice?.tokenPriceUsd?.shiftedBy(2);

  return {
    isLoading: isTokensPriceLoading,
    data: {
      stakedTokenPriceCents,
      rewardTokenPriceCents,
      userStakedUsdCents:
        userStakedMantissa && stakedTokenPriceCents
          ? convertPriceMantissaToDollars({
              priceMantissa: userStakedMantissa?.times(stakedTokenPriceCents),
              decimals: stakedToken.decimals,
            })
          : undefined,
      totalStakedUsdCents:
        totalStakedMantissa && stakedTokenPriceCents
          ? convertPriceMantissaToDollars({
              priceMantissa: totalStakedMantissa?.times(stakedTokenPriceCents),
              decimals: stakedToken.decimals,
            })
          : undefined,
      dailyEmissionUsdCents:
        dailyEmissionMantissa && rewardTokenPriceCents
          ? convertPriceMantissaToDollars({
              priceMantissa: dailyEmissionMantissa?.times(rewardTokenPriceCents),
              decimals: rewardToken.decimals,
            })
          : undefined,
    },
  };
};

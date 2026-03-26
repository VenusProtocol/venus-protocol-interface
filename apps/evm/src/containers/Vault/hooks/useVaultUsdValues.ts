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
      enabled: !('stakedTokenPriceCents' in vault && 'rewardTokenPriceCents' in vault),
    },
  );

  const [stakedTokenPrice, rewardTokenPrice] = tokenPrices ?? [];
  const stakedTokenPriceCents =
    'stakedTokenPriceCents' in vault
      ? vault.stakedTokenPriceCents
      : stakedTokenPrice?.tokenPriceUsd?.shiftedBy(2);
  const rewardTokenPriceCents =
    'rewardTokenPriceCents' in vault
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

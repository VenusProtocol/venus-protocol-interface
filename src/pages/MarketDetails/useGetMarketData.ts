import BigNumber from 'bignumber.js';
import React from 'react';
import { TokenId, VBepToken } from 'types';
import { convertPercentageFromSmartContract, convertWeiToTokens, getToken } from 'utilities';

import { useGetMarkets, useGetVTokenCash } from 'clients/api';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import { TOKENS, VTOKEN_DECIMALS } from 'constants/tokens';

const useGetMarketData = ({ vTokenId }: { vTokenId: VBepToken['id'] }) => {
  const { data: vTokenCashData } = useGetVTokenCash({
    vTokenId,
  });

  const { data: getMarketData } = useGetMarkets();
  const assetMarket = (getMarketData?.markets || []).find(market => market.id === vTokenId);

  return React.useMemo(() => {
    const totalBorrowBalanceCents = assetMarket && +assetMarket.totalBorrowsUsd * 100;
    const totalSupplyBalanceCents = assetMarket && +assetMarket.totalSupplyUsd * 100;
    const borrowApyPercentage = assetMarket?.borrowApy;
    const supplyApyPercentage = assetMarket?.supplyApy;
    const borrowDistributionApyPercentage = assetMarket && +assetMarket.borrowVenusApy;
    const supplyDistributionApyPercentage = assetMarket && +assetMarket.supplyVenusApy;
    const tokenPriceDollars = assetMarket?.tokenPrice;
    const liquidityCents = assetMarket && new BigNumber(assetMarket.liquidity).multipliedBy(100);
    const supplierCount = assetMarket?.supplierCount;
    const borrowerCount = assetMarket?.borrowerCount;
    const borrowCapTokens = assetMarket && new BigNumber(assetMarket.borrowCaps);
    const mintedTokens = assetMarket && new BigNumber(assetMarket.totalSupply2);
    const reserveFactorMantissa = assetMarket && new BigNumber(assetMarket.reserveFactor);

    const dailyDistributionXvs =
      assetMarket &&
      convertWeiToTokens({
        valueWei: new BigNumber(assetMarket.supplierDailyVenus).plus(
          assetMarket.borrowerDailyVenus,
        ),
        tokenId: TOKENS.xvs.id as TokenId,
      });

    const formattedSupplyRatePerBlock =
      assetMarket &&
      new BigNumber(assetMarket.supplyRatePerBlock).dividedBy(COMPOUND_MANTISSA).toNumber();

    const formattedBorrowRatePerBlock =
      assetMarket &&
      new BigNumber(assetMarket.borrowRatePerBlock).dividedBy(COMPOUND_MANTISSA).toNumber();

    // Calculate daily interests for suppliers and borrowers. Note that we don't
    // use BigNumber to calculate these values, as this would slow down
    // calculation a lot while the end result doesn't need to be extremely
    // precise
    const dailySupplyingInterestsCents =
      assetMarket &&
      formattedSupplyRatePerBlock &&
      // prettier-ignore
      +assetMarket.totalSupplyUsd * (((1 + formattedSupplyRatePerBlock) ** BLOCKS_PER_DAY) - 1) *
      // Convert to cents
      100;

    const dailyBorrowingInterestsCents =
      assetMarket &&
      formattedBorrowRatePerBlock &&
      // prettier-ignore
      +assetMarket.totalBorrowsUsd * (((1 + formattedBorrowRatePerBlock) ** BLOCKS_PER_DAY) - 1)
        // Convert to cents
        * 100;

    const reserveFactor =
      assetMarket && convertPercentageFromSmartContract(assetMarket.reserveFactor);

    const collateralFactor =
      assetMarket && convertPercentageFromSmartContract(assetMarket.collateralFactor);

    const reserveTokens =
      assetMarket &&
      convertWeiToTokens({
        valueWei: new BigNumber(assetMarket.totalReserves),
        tokenId: vTokenId,
      });

    const exchangeRateVTokens =
      assetMarket &&
      new BigNumber(1).div(
        new BigNumber(assetMarket.exchangeRate).div(
          new BigNumber(10).pow(18 + getToken(vTokenId).decimals - VTOKEN_DECIMALS),
        ),
      );

    let currentUtilizationRate: number | undefined;
    if (vTokenCashData?.cashWei && assetMarket && reserveTokens) {
      const vTokenCashTokens = convertWeiToTokens({
        valueWei: vTokenCashData.cashWei,
        tokenId: vTokenId,
      });

      currentUtilizationRate = new BigNumber(assetMarket.totalBorrows2)
        .div(vTokenCashTokens.plus(assetMarket.totalBorrows2).minus(reserveTokens))
        .multipliedBy(100)
        .dp(0)
        .toNumber();
    }

    return {
      totalBorrowBalanceCents,
      totalSupplyBalanceCents,
      borrowApyPercentage,
      supplyApyPercentage,
      borrowDistributionApyPercentage,
      supplyDistributionApyPercentage,
      tokenPriceDollars,
      liquidityCents,
      supplierCount,
      borrowerCount,
      borrowCapTokens,
      mintedTokens,
      dailyDistributionXvs,
      dailySupplyingInterestsCents,
      dailyBorrowingInterestsCents,
      reserveFactor,
      collateralFactor,
      reserveTokens,
      exchangeRateVTokens,
      currentUtilizationRate,
      reserveFactorMantissa,
    };
  }, [JSON.stringify(assetMarket), vTokenCashData?.cashWei.toFixed()]);
};

export default useGetMarketData;

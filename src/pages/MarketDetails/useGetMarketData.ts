import React from 'react';
import BigNumber from 'bignumber.js';

import { IVBepToken } from 'types';
import { getToken } from 'utilities';
import { convertWeiToCoins } from 'utilities/common';
import { VTOKEN_DECIMALS } from 'config';
import { useGetMarkets, useGetVTokenCash } from 'clients/api';

const useGetMarketData = ({
  vTokenId,
  vTokenAddress,
}: {
  vTokenId: IVBepToken['id'];
  vTokenAddress: IVBepToken['address'];
}) => {
  const { data: vTokenCashWei } = useGetVTokenCash({
    vTokenId,
  });

  const { data: getMarketData } = useGetMarkets();
  const assetMarket = (getMarketData?.markets || []).find(
    market => market.address.toLowerCase() === vTokenAddress.toLowerCase(),
  );

  return React.useMemo(() => {
    const totalBorrowBalanceCents = assetMarket && +assetMarket.totalBorrowsUsd * 100;
    const totalSupplyBalanceCents = assetMarket && +assetMarket.totalSupplyUsd * 100;
    const borrowApyPercentage = assetMarket?.borrowApy;
    const supplyApyPercentage = assetMarket?.supplyApy;
    const borrowDistributionApyPercentage = assetMarket && +assetMarket.borrowVenusApy;
    const supplyDistributionApyPercentage = assetMarket && +assetMarket.supplyVenusApy;
    const tokenPriceDollars = assetMarket && assetMarket.tokenPrice.toFixed(2);
    const liquidityCents = assetMarket && new BigNumber(assetMarket.liquidity).multipliedBy(100);
    const supplierCount = assetMarket?.supplierCount;
    const borrowerCount = assetMarket?.borrowerCount;
    const borrowCapCents = assetMarket && +assetMarket.borrowCaps * +assetMarket.tokenPrice * 100;
    const mintedTokens = assetMarket && new BigNumber(assetMarket.totalSupply2);
    const reserveFactorMantissa = assetMarket && new BigNumber(assetMarket.reserveFactor);

    const dailyInterestsCents =
      assetMarket &&
      convertWeiToCoins({
        valueWei: new BigNumber(assetMarket.supplierDailyVenus).plus(
          new BigNumber(assetMarket.borrowerDailyVenus),
        ),
        tokenId: 'xvs',
      })
        // Convert XVS to dollars
        .multipliedBy(assetMarket.tokenPrice)
        // Convert to cents
        .multipliedBy(100)
        .toNumber();

    const reserveFactor =
      assetMarket &&
      convertWeiToCoins({
        valueWei: new BigNumber(assetMarket.reserveFactor),
        tokenId: vTokenId,
      })
        // Convert to percentage
        .multipliedBy(100)
        .toNumber();

    const collateralFactor =
      assetMarket &&
      convertWeiToCoins({
        valueWei: new BigNumber(assetMarket.collateralFactor),
        tokenId: vTokenId,
      })
        // Convert to percentage
        .multipliedBy(100)
        .toNumber();

    const reserveTokens =
      assetMarket &&
      convertWeiToCoins({
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
    if (vTokenCashWei && assetMarket && reserveTokens) {
      const vTokenCashTokens = convertWeiToCoins({
        valueWei: vTokenCashWei,
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
      borrowCapCents,
      mintedTokens,
      dailyInterestsCents,
      reserveFactor,
      collateralFactor,
      reserveTokens,
      exchangeRateVTokens,
      currentUtilizationRate,
      reserveFactorMantissa,
    };
  }, [JSON.stringify(assetMarket), vTokenCashWei?.toFixed()]);
};

export default useGetMarketData;

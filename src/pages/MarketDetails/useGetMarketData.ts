import React from 'react';
import BigNumber from 'bignumber.js';

import { IVBepToken } from 'types';
import { getToken } from 'utilities';
import { convertWeiToCoins } from 'utilities/common';
import { VTOKEN_DECIMALS } from 'config';
import { useGetMarkets } from 'clients/api';

const useGetMarketData = ({
  vTokenId,
  vTokenAddress,
}: {
  vTokenId: IVBepToken['id'];
  vTokenAddress: IVBepToken['address'];
}) => {
  const { data: markets = [] } = useGetMarkets({ placeholderData: [] });
  const assetMarket = markets.find(
    market => market.address.toLowerCase() === vTokenAddress.toLowerCase(),
  );

  const props = React.useMemo(() => {
    const totalBorrowBalanceCents = assetMarket && +assetMarket.totalBorrowsUsd * 100;
    const totalSupplyBalanceCents = assetMarket && +assetMarket.totalSupplyUsd * 100;
    const borrowApyPercentage = assetMarket?.borrowApy;
    const supplyApyPercentage = assetMarket && +assetMarket.supplyApy;
    const borrowDistributionApyPercentage = assetMarket && +assetMarket.borrowVenusApy;
    const supplyDistributionApyPercentage = assetMarket && +assetMarket.supplyVenusApy;
    const tokenPriceDollars = assetMarket && +assetMarket.tokenPrice;
    const marketLiquidityTokens = assetMarket && new BigNumber(assetMarket.liquidity);
    const supplierCount = assetMarket?.supplierCount;
    const borrowerCount = assetMarket?.borrowerCount;
    const borrowCapCents = assetMarket && +assetMarket.borrowCaps * +assetMarket.tokenPrice * 100;
    const mintedTokens = assetMarket && new BigNumber(assetMarket.totalSupply2);

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

    // TODO: calculate actual value (see https://app.clickup.com/t/29xmavh)
    const currentUtilizationRate = 46;

    return {
      totalBorrowBalanceCents,
      totalSupplyBalanceCents,
      borrowApyPercentage,
      supplyApyPercentage,
      borrowDistributionApyPercentage,
      supplyDistributionApyPercentage,
      tokenPriceDollars,
      marketLiquidityTokens,
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
    };
  }, [JSON.stringify(assetMarket)]);

  return props;
};

export default useGetMarketData;

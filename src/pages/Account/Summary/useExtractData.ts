import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset } from 'types';
import {
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculateNetApy,
  calculateYearlyEarningsForAssets,
  convertTokensToWei,
  formatCentsToReadableValue,
} from 'utilities';

const useExtractData = ({
  assets,
  safeBorrowLimitPercentage,
}: {
  assets: Asset[];
  safeBorrowLimitPercentage?: number;
}) =>
  useMemo(() => {
    const { totalBorrowCents, totalSupplyCents, borrowLimitCents } = assets.reduce(
      (acc, asset) => ({
        totalBorrowCents: acc.totalBorrowCents.plus(
          asset.userBorrowBalanceTokens.times(asset.tokenPriceDollars).times(100),
        ),
        totalSupplyCents: acc.totalSupplyCents.plus(
          asset.userSupplyBalanceTokens.times(asset.tokenPriceDollars).times(100),
        ),
        borrowLimitCents: asset.isCollateralOfUser
          ? acc.borrowLimitCents.plus(
              calculateCollateralValue({
                amountWei: convertTokensToWei({
                  value: asset.userSupplyBalanceTokens,
                  token: asset.vToken.underlyingToken,
                }),
                token: asset.vToken.underlyingToken,
                tokenPriceDollars: asset.tokenPriceDollars,
                collateralFactor: asset.collateralFactor,
              }).times(100),
            )
          : acc.borrowLimitCents,
      }),
      {
        totalSupplyCents: new BigNumber(0),
        totalBorrowCents: new BigNumber(0),
        borrowLimitCents: new BigNumber(0),
      },
    );

    const yearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets,
    });

    const dailyEarningsCentsTmp =
      yearlyEarningsCents && calculateDailyEarningsCents(yearlyEarningsCents).toNumber();

    const netApyPercentageTmp =
      yearlyEarningsCents &&
      calculateNetApy({
        supplyBalanceCents: totalSupplyCents,
        yearlyEarningsCents,
      });

    const safeBorrowLimitCentsTmp =
      safeBorrowLimitPercentage && borrowLimitCents.multipliedBy(safeBorrowLimitPercentage / 100);

    const readableSafeBorrowLimitTmp = formatCentsToReadableValue({
      value: safeBorrowLimitCentsTmp,
    });

    return {
      dailyEarningsCents: dailyEarningsCentsTmp,
      netApyPercentage: netApyPercentageTmp,
      readableSafeBorrowLimit: readableSafeBorrowLimitTmp,
      totalBorrowCents,
      totalSupplyCents,
      borrowLimitCents,
    };
  }, [assets]);

export default useExtractData;

import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset } from 'types';
import {
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
  convertTokensToWei,
  formatCentsToReadableValue,
  formatToReadablePercentage,
} from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';

import calculateNetApy from './calculateNetApy';

const useExtractData = ({ assets }: { assets: Asset[] }) =>
  useMemo(() => {
    const { totalBorrowCents, totalSupplyCents, borrowLimitCents } = assets.reduce(
      (acc, asset) => ({
        totalBorrowCents: acc.totalBorrowCents.plus(
          asset.userBorrowBalanceTokens.times(asset.tokenPriceCents),
        ),
        totalSupplyCents: acc.totalSupplyCents.plus(
          asset.userSupplyBalanceTokens.times(asset.tokenPriceCents),
        ),
        borrowLimitCents: asset.isCollateralOfUser
          ? acc.borrowLimitCents.plus(
              calculateCollateralValue({
                amountWei: convertTokensToWei({
                  value: asset.userSupplyBalanceTokens,
                  token: asset.vToken.underlyingToken,
                }),
                token: asset.vToken.underlyingToken,
                tokenPriceCents: asset.tokenPriceCents,
                collateralFactor: asset.collateralFactor,
              }),
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

    const safeBorrowLimitCentsTmp = borrowLimitCents.multipliedBy(
      SAFE_BORROW_LIMIT_PERCENTAGE / 100,
    );

    const readableSafeBorrowLimitTmp = formatCentsToReadableValue({
      value: safeBorrowLimitCentsTmp,
    });

    const safeBorrowLimitPercentageTmp = formatToReadablePercentage(
      safeBorrowLimitCentsTmp.multipliedBy(100).dividedBy(borrowLimitCents),
    );

    return {
      dailyEarningsCents: dailyEarningsCentsTmp,
      netApyPercentage: netApyPercentageTmp,
      readableSafeBorrowLimit: readableSafeBorrowLimitTmp,
      safeBorrowLimitPercentage: safeBorrowLimitPercentageTmp,
      totalBorrowCents,
      totalSupplyCents,
      borrowLimitCents,
    };
  }, [assets]);

export default useExtractData;

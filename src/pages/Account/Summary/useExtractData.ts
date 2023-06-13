import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset, Vault } from 'types';
import {
  areTokensEqual,
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculateYearlyEarnings,
  calculateYearlyEarningsForAssets,
  convertTokensToWei,
  convertWeiToTokens,
  formatCentsToReadableValue,
  formatToReadablePercentage,
} from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { TOKENS } from 'constants/tokens';

import calculateNetApy from './calculateNetApy';

interface UseExtractDataInput {
  assets: Asset[];
  vaults: Vault[];
  xvsPriceCents: BigNumber;
  vaiPriceCents: BigNumber;
}

const useExtractData = ({ assets, vaults, xvsPriceCents, vaiPriceCents }: UseExtractDataInput) =>
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

    const { totalVaultStakeCents, yearlyVaultEarningsCents } = vaults.reduce(
      (accTotalVaultStakeCents, vault) => {
        const vaultStakeCents = convertWeiToTokens({
          valueWei: new BigNumber(vault.userStakedWei || 0),
          token: vault.stakedToken,
        }).multipliedBy(
          areTokensEqual(vault.stakedToken, TOKENS.xvs) ? xvsPriceCents : vaiPriceCents,
        );

        return {
          totalVaultStakeCents: accTotalVaultStakeCents.totalVaultStakeCents.plus(vaultStakeCents),
          yearlyVaultEarningsCents: accTotalVaultStakeCents.yearlyVaultEarningsCents.plus(
            calculateYearlyEarnings({
              balance: vaultStakeCents,
              interestPercentage: new BigNumber(vault.stakingAprPercentage),
            }),
          ),
        };
      },
      { totalVaultStakeCents: new BigNumber(0), yearlyVaultEarningsCents: new BigNumber(0) },
    );

    const yearlyAssetEarningsCents = new BigNumber(
      calculateYearlyEarningsForAssets({
        assets,
      }) || 0,
    );

    const yearlyEarningsCents = yearlyAssetEarningsCents.plus(yearlyVaultEarningsCents);
    const dailyEarningsCentsTmp = calculateDailyEarningsCents(yearlyEarningsCents).toNumber();

    const netApyPercentageTmp =
      yearlyAssetEarningsCents &&
      calculateNetApy({
        supplyBalanceCents: totalSupplyCents.plus(totalVaultStakeCents),
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
      totalVaultStakeCents,
      totalBorrowCents,
      totalSupplyCents,
      borrowLimitCents,
    };
  }, [assets, vaults, xvsPriceCents, vaiPriceCents]);

export default useExtractData;

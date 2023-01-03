/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  BorrowBalanceAccountHealth,
  Delimiter,
  LabeledInlineContent,
  LabeledInlineContentProps,
  ValueUpdate,
} from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
  convertTokensToWei,
  formatTokensToReadableValue,
} from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';

import { useStyles } from '../styles';

interface AccountDataProps {
  asset: Asset;
  assets: Asset[];
  tokenInfo: LabeledInlineContentProps[];
  userTotalBorrowBalanceCents: BigNumber;
  userTotalBorrowLimitCents: BigNumber;
  calculateNewBalance: (initial: BigNumber, amount: BigNumber) => BigNumber;
  amountValue: string;
  amount: BigNumber;
  validAmount: boolean;
}

export const AccountData: React.FC<AccountDataProps> = ({
  asset,
  tokenInfo,
  userTotalBorrowBalanceCents,
  userTotalBorrowLimitCents,
  assets,
  calculateNewBalance,
  amount,
  amountValue,
  validAmount,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const hypotheticalTokenSupplyBalance = amountValue
    ? calculateNewBalance(asset.userSupplyBalanceTokens, amount)
    : undefined;

  const hypotheticalBorrowLimitCents = useMemo(() => {
    let updateBorrowLimitCents;

    if (asset?.tokenPriceDollars && validAmount) {
      const amountInCents = calculateCollateralValue({
        amountWei: convertTokensToWei({ value: amount, token: asset.vToken.underlyingToken }),
        token: asset.vToken.underlyingToken,
        tokenPriceDollars: asset.tokenPriceDollars,
        collateralFactor: asset.collateralFactor,
      }).times(100);

      const temp = calculateNewBalance(userTotalBorrowLimitCents, amountInCents);
      updateBorrowLimitCents = BigNumber.maximum(temp, 0);
    }

    return updateBorrowLimitCents;
  }, [
    amount,
    asset.vToken.underlyingToken,
    userTotalBorrowBalanceCents,
    userTotalBorrowLimitCents,
  ]);

  const [dailyEarningsCents, hypotheticalDailyEarningCents] = useMemo(() => {
    let hypotheticalDailyEarningCentsValue;
    const hypotheticalAssets = [...assets];

    const yearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets,
    });

    const dailyEarningsCentsValue =
      yearlyEarningsCents && calculateDailyEarningsCents(yearlyEarningsCents);

    // Modify asset with hypotheticalBalance
    if (validAmount) {
      const hypotheticalAsset = {
        ...asset,
        supplyBalance: calculateNewBalance(asset.userSupplyBalanceTokens, amount),
      };
      const currentIndex = assets.findIndex(
        a =>
          a.vToken.underlyingToken.address.toLowerCase() ===
          asset.vToken.underlyingToken.address.toLowerCase(),
      );
      hypotheticalAssets.splice(currentIndex, 1, hypotheticalAsset);

      const hypotheticalYearlyEarningsCents = calculateYearlyEarningsForAssets({
        assets: hypotheticalAssets,
      });

      hypotheticalDailyEarningCentsValue =
        hypotheticalYearlyEarningsCents &&
        calculateDailyEarningsCents(hypotheticalYearlyEarningsCents);
    }
    return [dailyEarningsCentsValue, hypotheticalDailyEarningCentsValue];
  }, [amount, asset.vToken.underlyingToken.address, JSON.stringify(assets)]);

  return (
    <>
      {tokenInfo.map((info, index) => (
        <LabeledInlineContent
          css={styles.getRow({ isLast: index === tokenInfo.length - 1 })}
          className="info-row"
          {...info}
          key={info.label}
        />
      ))}

      <Delimiter css={styles.getRow({ isLast: true })} />

      <BorrowBalanceAccountHealth
        css={styles.getRow({ isLast: true })}
        borrowBalanceCents={userTotalBorrowBalanceCents.toNumber()}
        borrowLimitCents={
          hypotheticalBorrowLimitCents?.toNumber() || userTotalBorrowLimitCents.toNumber()
        }
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      />

      <LabeledInlineContent
        label={t('supplyWithdraw.supplyBalance', {
          tokenSymbol: asset.vToken.underlyingToken.symbol,
        })}
        css={styles.getRow({ isLast: false })}
        className="info-row"
      >
        <ValueUpdate
          original={asset.userSupplyBalanceTokens}
          update={hypotheticalTokenSupplyBalance}
          format={(value: BigNumber | undefined) =>
            formatTokensToReadableValue({
              value,
              token: asset.vToken.underlyingToken,
              minimizeDecimals: true,
              addSymbol: false,
            })
          }
        />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('supplyWithdraw.borrowLimit')}
        css={styles.getRow({ isLast: false })}
        className="info-row"
      >
        <ValueUpdate original={userTotalBorrowLimitCents} update={hypotheticalBorrowLimitCents} />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('supplyWithdraw.dailyEarnings')}
        css={styles.getRow({ isLast: true })}
        className="info-row"
      >
        <ValueUpdate original={dailyEarningsCents} update={hypotheticalDailyEarningCents} />
      </LabeledInlineContent>
    </>
  );
};

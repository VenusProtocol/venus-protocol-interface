/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset } from 'types';
import { AuthContext } from 'context/AuthContext';
import { useUserMarketInfo } from 'clients/api';
import { formatToReadablePercentage } from 'utilities/common';
import calculateDailyEarningsCentsUtil from 'utilities/calculateDailyEarningsCents';
import { calculateYearlyEarningsForAssets } from 'utilities/calculateYearlyEarnings';
import calculatePercentage from 'utilities/calculatePercentage';
import {
  BorrowBalanceAccountHealth,
  LabeledInlineContent,
  ValueUpdate,
  Delimiter,
} from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../../styles';

export interface IAccountDataProps {
  asset: Asset;
  hypotheticalBorrowAmountTokens: number;
  isXvsEnabled: boolean;
}

const AccountData: React.FC<IAccountDataProps> = ({
  asset,
  hypotheticalBorrowAmountTokens,
  isXvsEnabled,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { account } = React.useContext(AuthContext);

  const { assets, userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    accountAddress: account?.address,
  });

  const totalBorrowBalanceCents = userTotalBorrowBalance.multipliedBy(100);
  const borrowLimitCents = userTotalBorrowLimit.multipliedBy(100);

  const hypotheticalTotalBorrowBalanceCents =
    hypotheticalBorrowAmountTokens !== 0
      ? totalBorrowBalanceCents.plus(
          asset.tokenPrice
            .multipliedBy(hypotheticalBorrowAmountTokens)
            // Convert dollars to cents
            .multipliedBy(100),
        )
      : undefined;

  const borrowLimitUsedPercentage = React.useMemo(
    () =>
      calculatePercentage({
        numerator: totalBorrowBalanceCents.toNumber(),
        denominator: borrowLimitCents.toNumber(),
      }),
    [totalBorrowBalanceCents.toNumber(), borrowLimitCents.toNumber()],
  );

  const hypotheticalBorrowLimitUsedPercentage =
    hypotheticalTotalBorrowBalanceCents &&
    calculatePercentage({
      numerator: hypotheticalTotalBorrowBalanceCents.toNumber(),
      denominator: borrowLimitCents.toNumber(),
    });

  const calculateDailyEarningsCents = React.useCallback(
    (tokenAmount: BigNumber) => {
      const updatedAssets = assets.map(assetData => ({
        ...assetData,
        borrowBalance:
          assetData.id === asset.id
            ? assetData.borrowBalance.plus(tokenAmount)
            : assetData.borrowBalance,
      }));

      const yearlyEarningsCents = calculateYearlyEarningsForAssets({
        assets: updatedAssets,
        isXvsEnabled,
      });

      return yearlyEarningsCents
        ? calculateDailyEarningsCentsUtil(yearlyEarningsCents)
        : new BigNumber(0);
    },
    [JSON.stringify(assets), totalBorrowBalanceCents.toFixed()],
  );

  const dailyEarningsCents = React.useMemo(() => calculateDailyEarningsCents(new BigNumber(0)), []);
  const hypotheticalDailyEarningsCents =
    hypotheticalBorrowAmountTokens !== 0
      ? calculateDailyEarningsCents(new BigNumber(hypotheticalBorrowAmountTokens))
      : undefined;

  const readableBorrowApy = React.useMemo(
    () => formatToReadablePercentage(asset.borrowApy.toFixed(2)),
    [asset.borrowApy.toFixed()],
  );
  const readableDistributionApy = React.useMemo(
    () => formatToReadablePercentage(asset.xvsBorrowApy.toFixed(2)),
    [asset.xvsBorrowApy.toFixed()],
  );

  return (
    <>
      <BorrowBalanceAccountHealth
        borrowBalanceCents={totalBorrowBalanceCents.toNumber()}
        borrowLimitCents={borrowLimitCents.toNumber()}
        hypotheticalBorrowBalanceCents={hypotheticalTotalBorrowBalanceCents?.toNumber()}
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
        css={styles.getRow({ isLast: true })}
      />

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowLimitUsed')}
        css={styles.getRow({ isLast: false })}
      >
        <ValueUpdate
          original={borrowLimitUsedPercentage}
          update={hypotheticalBorrowLimitUsedPercentage}
          positiveDirection="desc"
          format={formatToReadablePercentage}
        />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowBalance')}
        css={styles.getRow({ isLast: true })}
      >
        <ValueUpdate
          original={totalBorrowBalanceCents.toNumber()}
          update={hypotheticalTotalBorrowBalanceCents?.toNumber()}
          positiveDirection="desc"
        />
      </LabeledInlineContent>

      <Delimiter css={styles.getRow({ isLast: true })} />

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowAPy')}
        iconName={asset.id}
        css={styles.getRow({ isLast: false })}
      >
        {readableBorrowApy}
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.distributionAPy')}
        iconName="xvs"
        css={styles.getRow({ isLast: true })}
      >
        {readableDistributionApy}
      </LabeledInlineContent>

      <Delimiter css={styles.getRow({ isLast: true })} />

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.dailyEarnings')}
        css={styles.bottomRow}
      >
        <ValueUpdate
          original={dailyEarningsCents.toNumber()}
          update={hypotheticalDailyEarningsCents?.toNumber()}
        />
      </LabeledInlineContent>
    </>
  );
};

export default AccountData;

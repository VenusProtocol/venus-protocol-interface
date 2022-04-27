/** @jsxImportSource @emotion/react */
import React from 'react';
import { FormikProps } from 'formik';
import BigNumber from 'bignumber.js';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset } from 'types';
import { FormValues } from 'containers/AmountForm';
import { formatToReadablePercentage } from 'utilities/common';
import calculatePercentage from 'utilities/calculatePercentage';
import { AccountHealth, LabeledInlineContent, ValueUpdate, Delimiter } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../../styles';

export interface IAccountDataProps {
  asset: Asset;
  amount: FormikProps<FormValues>['values']['amount'];
  totalBorrowBalanceCents: BigNumber;
  borrowLimitCents: BigNumber;
  calculateDailyEarningsCents: (tokenAmount: BigNumber) => BigNumber;
}

const AccountData: React.FC<IAccountDataProps> = ({
  asset,
  amount,
  totalBorrowBalanceCents,
  borrowLimitCents,
  calculateDailyEarningsCents,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const isAmountPositive = amount && +amount > 0;
  const hypotheticalTotalBorrowBalanceCents = isAmountPositive
    ? totalBorrowBalanceCents.plus(
        asset.tokenPrice
          .multipliedBy(amount)
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

  const dailyEarningsCents = React.useMemo(() => calculateDailyEarningsCents(new BigNumber(0)), []);
  const hypotheticalDailyEarningsCents = isAmountPositive
    ? calculateDailyEarningsCents(new BigNumber(amount))
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
      <AccountHealth
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

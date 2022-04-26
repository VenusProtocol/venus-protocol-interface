/** @jsxImportSource @emotion/react */
import React from 'react';
import { FormikProps } from 'formik';
import BigNumber from 'bignumber.js';

import { getToken } from 'utilities';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset } from 'types';
import { AuthContext } from 'context/AuthContext';
import { FormValues } from 'containers/AmountForm/validationSchema';
import { AmountForm } from 'containers/AmountForm';
import { formatToReadablePercentage } from 'utilities/common';
import calculatePercentage from 'utilities/calculatePercentage';
import {
  PrimaryButton,
  TokenTextField,
  AccountHealth,
  LabeledInlineContent,
  ValueUpdate,
  Delimiter,
} from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../../styles';

export interface IBorrowUiProps
  extends Pick<
    FormikProps<FormValues>,
    'values' | 'setFieldValue' | 'handleBlur' | 'dirty' | 'isValid'
  > {
  disabled: boolean;
  asset: Asset;
  safeBorrowLimitPercentage: number;
  userTotalBorrowBalanceCents: BigNumber;
  userBorrowLimitCents: BigNumber;
  calculateDailyEarningsCents: (tokenAmount: BigNumber) => BigNumber;
}

export const BorrowUi: React.FC<IBorrowUiProps> = ({
  disabled,
  asset,
  values,
  setFieldValue,
  handleBlur,
  dirty,
  isValid,
  safeBorrowLimitPercentage,
  userTotalBorrowBalanceCents,
  userBorrowLimitCents,
  calculateDailyEarningsCents,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const isAmountValid = values.amount && +values.amount > 0;
  const hypotheticalUserTotalBorrowBalanceCents = isAmountValid
    ? userTotalBorrowBalanceCents.plus(
        asset.tokenPrice
          .multipliedBy(values.amount)
          // Convert dollars to cents
          .multipliedBy(100),
      )
    : undefined;

  const borrowLimitUsedPercentage = calculatePercentage({
    numerator: userTotalBorrowBalanceCents.toNumber(),
    denominator: userBorrowLimitCents.toNumber(),
  });
  const hypotheticalBorrowLimitUsedPercentage =
    hypotheticalUserTotalBorrowBalanceCents &&
    calculatePercentage({
      numerator: hypotheticalUserTotalBorrowBalanceCents.toNumber(),
      denominator: userBorrowLimitCents.toNumber(),
    });

  const dailyEarningsCents = calculateDailyEarningsCents(new BigNumber(0));
  const hypotheticalDailyEarningsCents = isAmountValid
    ? calculateDailyEarningsCents(new BigNumber(values.amount))
    : undefined;

  // Calculate safe maximum amount of coins user can borrow
  const safeMaxCoins = React.useMemo(() => {
    const safeBorrowLimitCents = userBorrowLimitCents.multipliedBy(safeBorrowLimitPercentage / 100);
    const marginWithSafeBorrowLimitCents = safeBorrowLimitCents.minus(userTotalBorrowBalanceCents);

    const tokenDecimals = getToken(asset.id).decimals;

    return (
      marginWithSafeBorrowLimitCents
        // Convert cents to dollars
        .dividedBy(100)
        // Convert dollars to coins
        .dividedBy(asset.tokenPrice)
        // Format value
        .toFixed(tokenDecimals, BigNumber.ROUND_DOWN)
    );
  }, [
    asset.id,
    asset.tokenPrice,
    userBorrowLimitCents.toFixed(),
    safeBorrowLimitPercentage,
    userTotalBorrowBalanceCents.toFixed(),
  ]);

  const readableBorrowApy = formatToReadablePercentage(asset.borrowApy.toFixed(2));
  const readableDistributionApy = formatToReadablePercentage(asset.xvsBorrowApy.toFixed(2));

  return (
    <>
      <TokenTextField
        name="amount"
        css={styles.getRow({ isLast: true })}
        tokenId={asset.id}
        value={values.amount}
        onChange={amount => setFieldValue('amount', amount, true)}
        max={safeMaxCoins}
        onBlur={handleBlur}
        disabled={disabled}
        rightMaxButtonLabel={t('borrowRepayModal.borrow.rightMaxButtonLabel', {
          limitPercentage: safeBorrowLimitPercentage,
        })}
      />

      <AccountHealth
        borrowBalanceCents={userTotalBorrowBalanceCents.toNumber()}
        borrowLimitCents={userBorrowLimitCents.toNumber()}
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
          original={userTotalBorrowBalanceCents.toNumber()}
          update={hypotheticalUserTotalBorrowBalanceCents?.toNumber()}
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

      <PrimaryButton type="submit" disabled={disabled || !isValid || !dirty} fullWidth>
        {isValid
          ? t('borrowRepayModal.borrow.submitButton')
          : t('borrowRepayModal.borrow.submitButtonDisabled')}
      </PrimaryButton>
    </>
  );
};

export interface IBorrowProps {
  asset: Asset;
}

const Borrow: React.FC<IBorrowProps> = ({ asset }) => {
  const { account } = React.useContext(AuthContext);

  // @TODO: fetch actual values (https://app.clickup.com/t/24qunn3)
  const userTotalBorrowBalanceCents = new BigNumber('100000');
  const userBorrowLimitCents = new BigNumber('2000000');

  // @TODO: add real calculation using assets (https://app.clickup.com/t/24qunn3)
  const calculateDailyEarningsCents: IBorrowUiProps['calculateDailyEarningsCents'] = tokenAmount =>
    new BigNumber('100').plus(tokenAmount);

  // @TODO: send borrow request
  const handleSubmit = (amountTokens: string) => {
    console.log(amountTokens);
  };

  return (
    // @TODO: add ConnectWallet wrapper (https://app.clickup.com/t/24qunn3)
    // @TODO: add EnableToken wrapper (https://app.clickup.com/t/24qunn3)
    <AmountForm onSubmit={handleSubmit}>
      {({ values, setFieldValue, handleBlur, dirty, isValid }) => (
        <BorrowUi
          asset={asset}
          disabled={!account}
          userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
          userBorrowLimitCents={userBorrowLimitCents}
          safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
          calculateDailyEarningsCents={calculateDailyEarningsCents}
          values={values}
          setFieldValue={setFieldValue}
          handleBlur={handleBlur}
          dirty={dirty}
          isValid={isValid}
        />
      )}
    </AmountForm>
  );
};

export default Borrow;

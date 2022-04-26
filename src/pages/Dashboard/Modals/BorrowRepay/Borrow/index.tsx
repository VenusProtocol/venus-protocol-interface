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

type ProjectableValue<T> = {
  current: T;
  projected?: T;
};

export interface IBorrowUiProps extends FormikProps<FormValues> {
  disabled: boolean;
  asset: Asset;
  safeBorrowLimitPercentage: number;
  userTotalBorrowBalanceCents: ProjectableValue<BigNumber>;
  userBorrowLimitCents: BigNumber;
  dailyEarningsCents: ProjectableValue<BigNumber>;
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
  dailyEarningsCents,
  userBorrowLimitCents,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const borrowLimitUsedPercentage: ProjectableValue<number> = {
    current: calculatePercentage({
      numerator: userTotalBorrowBalanceCents.current.toNumber(),
      denominator: userBorrowLimitCents.toNumber(),
    }),
    projected:
      userTotalBorrowBalanceCents.projected &&
      calculatePercentage({
        numerator: userTotalBorrowBalanceCents.projected.toNumber(),
        denominator: userBorrowLimitCents.toNumber(),
      }),
  };

  // Calculate safe maximum amount of coins user can borrow
  const safeMaxCoins = React.useMemo(() => {
    const safeBorrowLimitCents = userBorrowLimitCents.multipliedBy(safeBorrowLimitPercentage / 100);
    const marginWithSafeBorrowLimitCents = safeBorrowLimitCents.minus(
      userTotalBorrowBalanceCents.current,
    );

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
    userTotalBorrowBalanceCents.current.toFixed(),
  ]);

  const readableBorrowApy = formatToReadablePercentage(asset.borrowApy.toFixed(2));
  const readableDistributionApy = formatToReadablePercentage(asset.xvsBorrowApy.toFixed(2));

  return (
    <>
      <TokenTextField
        name="amount"
        css={styles.input}
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
        borrowBalanceCents={userTotalBorrowBalanceCents.current.toNumber()}
        borrowLimitCents={userBorrowLimitCents.toNumber()}
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      />

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowLimitUsed')}
        css={[styles.infoRow, styles.borrowLimit]}
      >
        <ValueUpdate
          original={borrowLimitUsedPercentage.current}
          update={borrowLimitUsedPercentage.projected}
          positiveDirection="desc"
          format={formatToReadablePercentage}
        />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowBalance')}
        css={[styles.infoRow, styles.borrowLimit]}
      >
        <ValueUpdate
          original={userTotalBorrowBalanceCents.current.toNumber()}
          update={userTotalBorrowBalanceCents.projected?.toNumber()}
          positiveDirection="desc"
        />
      </LabeledInlineContent>

      <Delimiter />

      <LabeledInlineContent label={t('borrowRepayModal.borrow.borrowAPy')} iconName={asset.id}>
        {readableBorrowApy}
      </LabeledInlineContent>

      <LabeledInlineContent label={t('borrowRepayModal.borrow.distributionAPy')} iconName="xvs">
        {readableDistributionApy}
      </LabeledInlineContent>

      <Delimiter />

      <LabeledInlineContent label={t('borrowRepayModal.borrow.dailyEarnings')}>
        <ValueUpdate
          original={dailyEarningsCents.current.toNumber()}
          update={dailyEarningsCents.projected?.toNumber()}
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

  // TODO: fetch actual values (https://app.clickup.com/t/24qunn3)
  const userTotalBorrowBalanceCents = {
    current: new BigNumber('100000'),
    projected: new BigNumber('1000000'),
  };
  const userBorrowLimitCents = new BigNumber('2000000');
  const dailyEarningsCents = {
    current: new BigNumber('100'),
    projected: new BigNumber('1000'),
  };

  return (
    // @TODO: add ConnectWallet wrapper (https://app.clickup.com/t/24qunn3)
    // @TODO: add EnableToken wrapper (https://app.clickup.com/t/24qunn3)
    <AmountForm onSubmit={() => {}}>
      {formikProps => (
        <BorrowUi
          asset={asset}
          disabled={!account}
          userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
          userBorrowLimitCents={userBorrowLimitCents}
          safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
          dailyEarningsCents={dailyEarningsCents}
          {...formikProps}
        />
      )}
    </AmountForm>
  );
};

export default Borrow;

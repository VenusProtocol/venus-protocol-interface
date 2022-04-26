/** @jsxImportSource @emotion/react */
import React from 'react';
import { FormikProps } from 'formik';
import BigNumber from 'bignumber.js';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset } from 'types';
import { AuthContext } from 'context/AuthContext';
import { FormValues } from 'containers/AmountForm/validationSchema';
import { AmountForm } from 'containers/AmountForm';
import { PrimaryButton, TokenTextField } from 'components';
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
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  // TODO: calculate input max value (https://app.clickup.com/t/24qunn3)
  const max = '10000';

  return (
    <>
      <TokenTextField
        name="amount"
        css={styles.input}
        tokenId={asset.id}
        value={values.amount}
        onChange={amount => setFieldValue('amount', amount, true)}
        max={max}
        onBlur={handleBlur}
        disabled={disabled}
        rightMaxButtonLabel={t('borrowRepayModal.borrow.rightMaxButtonLabel', {
          limitPercentage: safeBorrowLimitPercentage,
        })}
      />

      <PrimaryButton type="submit" disabled={disabled || !isValid || !dirty} fullWidth>
        {t('borrowRepayModal.borrow.submitButton')}
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
    current: new BigNumber('1000000000'),
    projected: new BigNumber('1000000000'),
  };

  const dailyEarningsCents = {
    current: new BigNumber('100000'),
    projected: new BigNumber('1000000'),
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
          safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
          dailyEarningsCents={dailyEarningsCents}
          {...formikProps}
        />
      )}
    </AmountForm>
  );
};

export default Borrow;

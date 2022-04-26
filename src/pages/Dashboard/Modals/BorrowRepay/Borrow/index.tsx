/** @jsxImportSource @emotion/react */
import React from 'react';
import { FormikProps } from 'formik';
import BigNumber from 'bignumber.js';

import { Asset } from 'types';
import { AuthContext } from 'context/AuthContext';
import { FormValues } from 'containers/AmountForm/validationSchema';
import { AmountForm } from 'containers/AmountForm';
import { PrimaryButton, TokenTextField } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../../styles';

export interface IBorrowUiProps extends FormikProps<FormValues> {
  disabled: boolean;
  userTotalBorrowBalance: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  asset: Asset;
}

export const BorrowUi: React.FC<IBorrowUiProps> = ({
  disabled,
  asset,
  values,
  setFieldValue,
  handleBlur,
  dirty,
  isValid,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  // TODO: calculate input max value
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
        rightMaxButtonLabel={t('borrowRepayModal.borrow.rightMaxButtonLabel')}
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

  const userTotalBorrowBalance = new BigNumber('10000000000');
  const userTotalBorrowBalanceCents = new BigNumber('10000000000');

  return (
    <AmountForm onSubmit={() => {}}>
      {formikProps => (
        <BorrowUi
          disabled={!account}
          userTotalBorrowBalance={userTotalBorrowBalance}
          userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
          asset={asset}
          {...formikProps}
        />
      )}
    </AmountForm>
  );
};

export default Borrow;

/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { AccountData, FormikSubmitButton, FormikTokenTextField, toast } from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';

import { useStyles } from '../styles';
import TEST_IDS from './testIds';

interface WithdrawFormUiProps {
  asset: Asset;
  pool: Pool;
  maxInput: BigNumber;
  inputLabel: string;
  enabledButtonKey: string;
  disabledButtonKey: string;
  isTransactionLoading: boolean;
  amountValue: string;
}

export const WithdrawContent: React.FC<WithdrawFormUiProps> = ({
  asset,
  pool,
  maxInput,
  inputLabel,
  enabledButtonKey,
  disabledButtonKey,
  isTransactionLoading,
  amountValue,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const amount = new BigNumber(amountValue || 0);
  const isAmountValid = amount && !amount.isZero() && !amount.isNaN();

  return (
    <>
      <FormikTokenTextField
        data-testid={TEST_IDS.valueInput}
        name="amount"
        token={asset.vToken.underlyingToken}
        disabled={isTransactionLoading}
        rightMaxButton={{
          label: t('supplyWithdraw.withdraw.max').toUpperCase(),
          valueOnClick: maxInput.toFixed(),
        }}
        css={styles.input}
        // Only display error state if amount is higher than borrow limit
        displayableErrorCodes={[ErrorCode.HIGHER_THAN_MAX]}
      />

      <Typography
        component="div"
        variant="small2"
        css={[styles.greyLabel, styles.getRow({ isLast: true })]}
      >
        <Trans
          i18nKey={inputLabel}
          components={{
            White: <span css={styles.whiteLabel} />,
          }}
          values={{
            amount: formatTokensToReadableValue({
              value: maxInput,
              token: asset.vToken.underlyingToken,
            }),
          }}
        />
      </Typography>

      <AccountData amountTokens={amount} asset={asset} pool={pool} action="withdraw" />

      <FormikSubmitButton
        fullWidth
        data-testid={TEST_IDS.submitButton}
        disabled={!isAmountValid}
        loading={isTransactionLoading}
        enabledLabel={enabledButtonKey}
        disabledLabel={disabledButtonKey}
      />
    </>
  );
};

interface WithdrawFormProps extends Omit<WithdrawFormUiProps, 'amountValue'> {
  onSubmit: AmountFormProps['onSubmit'];
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onSubmit, maxInput, ...props }) => {
  const onSubmitHandleError: AmountFormProps['onSubmit'] = async (value: string) => {
    try {
      await onSubmit(value);
    } catch (error) {
      let { message } = error as Error;
      if (error instanceof VError) {
        message = formatVErrorToReadableString(error);
        toast.error({
          message,
        });
      }
    }
  };

  return (
    <AmountForm onSubmit={onSubmitHandleError} maxAmount={maxInput.toFixed()}>
      {({ values }) => (
        <WithdrawContent maxInput={maxInput} amountValue={values.amount} {...props} />
      )}
    </AmountForm>
  );
};

export default WithdrawForm;

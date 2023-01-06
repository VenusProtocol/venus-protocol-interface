/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import {
  FormikSubmitButton,
  FormikTokenTextField,
  IsolatedAssetWarning,
  LabeledInlineContentProps,
  toast,
} from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import { areTokensEqual, formatTokensToReadableValue } from 'utilities';

import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';

import { AccountData } from '../AccountData';
import { useStyles } from '../styles';
import TEST_IDS from './testIds';

interface SupplyFormUiProps {
  asset: Asset;
  pool: Pool;
  tokenInfo: LabeledInlineContentProps[];
  maxInput: BigNumber;
  inputLabel: string;
  enabledButtonKey: string;
  disabledButtonKey: string;
  isTransactionLoading: boolean;
  amountValue: string;
}

export const SupplyContent: React.FC<SupplyFormUiProps> = ({
  asset,
  pool,
  tokenInfo,
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
  const isValidAmount = amount && !amount.isZero() && !amount.isNaN();

  // Prevent users from supplying LUNA tokens. This is a temporary hotfix
  // following the crash of the LUNA token
  const isSupplyingLuna = areTokensEqual(asset.vToken.underlyingToken, TOKENS.luna);

  return (
    <>
      {pool.isIsolated && (
        <IsolatedAssetWarning
          token={asset.vToken.underlyingToken}
          pool={pool}
          type="supply"
          css={styles.isolatedAssetWarning}
        />
      )}

      <FormikTokenTextField
        data-testid={TEST_IDS.valueInput}
        name="amount"
        token={asset.vToken.underlyingToken}
        disabled={isTransactionLoading || isSupplyingLuna}
        rightMaxButton={{
          label: t('supplyWithdraw.max').toUpperCase(),
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

      <AccountData
        amount={amount}
        isAmountValid={isValidAmount}
        asset={asset}
        pool={pool}
        tokenInfo={tokenInfo}
        action="supply"
      />

      <FormikSubmitButton
        fullWidth
        data-testid={TEST_IDS.submitButton}
        disabled={!isValidAmount || isSupplyingLuna}
        loading={isTransactionLoading}
        enabledLabel={enabledButtonKey}
        disabledLabel={disabledButtonKey}
      />
    </>
  );
};

interface SupplyFormProps extends Omit<SupplyFormUiProps, 'amountValue'> {
  onSubmit: AmountFormProps['onSubmit'];
}

const SupplyForm: React.FC<SupplyFormProps> = ({ onSubmit, maxInput, ...props }) => {
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
      {({ values }) => <SupplyContent maxInput={maxInput} amountValue={values.amount} {...props} />}
    </AmountForm>
  );
};

export default SupplyForm;

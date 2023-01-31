/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import {
  AccountData,
  FormikSubmitButton,
  FormikTokenTextField,
  IsolatedAssetWarning,
  toast,
} from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import { areTokensEqual, formatTokensToReadableValue } from 'utilities';

import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';

import { useStyles } from '../styles';
import Notice from './Notice';
import TEST_IDS from './testIds';

interface SupplyFormUiProps {
  asset: Asset;
  pool: Pool;
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
          data-testid={TEST_IDS.noticeIsolatedAsset}
        />
      )}

      <div css={[styles.getRow({ isLast: true })]}>
        <FormikTokenTextField
          data-testid={TEST_IDS.valueInput}
          name="amount"
          token={asset.vToken.underlyingToken}
          disabled={isTransactionLoading || isSupplyingLuna}
          rightMaxButton={{
            label: t('supplyWithdraw.supply.max').toUpperCase(),
            valueOnClick: maxInput.toFixed(),
          }}
          css={styles.input}
          // Only display error state if amount is higher than borrow limit
          displayableErrorCodes={[ErrorCode.HIGHER_THAN_MAX]}
        />

        <Typography component="div" variant="small2" css={[styles.greyLabel]}>
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

        <Notice asset={asset} amount={amount} />
      </div>

      <AccountData amountTokens={amount} asset={asset} pool={pool} action="supply" />

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

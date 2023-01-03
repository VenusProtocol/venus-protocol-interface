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
import { Asset } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';

import { AccountData } from '../AccountData';
import { useStyles } from '../styles';
import TEST_IDS from './testIds';

interface SupplyFormUiProps {
  asset: Asset;
  assets: Asset[];
  tokenInfo: LabeledInlineContentProps[];
  maxInput: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalBorrowLimitCents: BigNumber;
  inputLabel: string;
  enabledButtonKey: string;
  disabledButtonKey: string;
  calculateNewBalance: (initial: BigNumber, amount: BigNumber) => BigNumber;
  isTransactionLoading: boolean;
  amountValue: string;
}

export const SupplyContent: React.FC<SupplyFormUiProps> = ({
  asset,
  tokenInfo,
  userTotalBorrowBalanceCents,
  userTotalBorrowLimitCents,
  assets,
  maxInput,
  inputLabel,
  enabledButtonKey,
  disabledButtonKey,
  calculateNewBalance,
  isTransactionLoading,
  amountValue,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const amount = new BigNumber(amountValue || 0);
  const validAmount = amount && !amount.isZero() && !amount.isNaN();

  // Prevent users from supplying LUNA tokens. This is a temporary hotfix
  // following the crash of the LUNA token
  const isSupplyingLuna =
    asset.vToken.underlyingToken.address.toLowerCase() === TOKENS.luna.address.toLowerCase();

  // TODO: fetch actual value (see VEN-546)
  const isIsolatedAsset = true;

  return (
    <>
      {isIsolatedAsset && (
        // TODO: fetch actual values (see VEN-546)
        <IsolatedAssetWarning
          poolComptrollerAddress="FAKE-POOL-COMPTROLLER-ADDRESS"
          asset={asset}
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
        amountValue={amountValue}
        amount={amount}
        validAmount={validAmount}
        asset={asset}
        assets={assets}
        calculateNewBalance={calculateNewBalance}
        tokenInfo={tokenInfo}
        userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
        userTotalBorrowLimitCents={userTotalBorrowLimitCents}
      />

      <FormikSubmitButton
        fullWidth
        data-testid={TEST_IDS.submitButton}
        disabled={!validAmount || isSupplyingLuna}
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

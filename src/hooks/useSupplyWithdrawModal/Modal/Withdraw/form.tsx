/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import {
  BorrowBalanceAccountHealth,
  Delimiter,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
  LabeledInlineContentProps,
  ValueUpdate,
  toast,
} from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
  convertTokensToWei,
  formatTokensToReadableValue,
} from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';

import { useStyles } from '../styles';
import TEST_IDS from './testIds';

interface WithdrawFormUiProps {
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

export const WithdrawContent: React.FC<WithdrawFormUiProps> = ({
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

  const hypotheticalTokenSupplyBalance = amountValue
    ? calculateNewBalance(asset.userSupplyBalanceTokens, amount)
    : undefined;

  const hypotheticalBorrowLimitCents = useMemo(() => {
    let updateBorrowLimitCents;

    if (asset?.tokenPriceDollars && validAmount) {
      const amountInCents = calculateCollateralValue({
        amountWei: convertTokensToWei({ value: amount, token: asset.vToken.underlyingToken }),
        token: asset.vToken.underlyingToken,
        tokenPriceDollars: asset.tokenPriceDollars,
        collateralFactor: asset.collateralFactor,
      }).times(100);

      const temp = calculateNewBalance(userTotalBorrowLimitCents, amountInCents);
      updateBorrowLimitCents = BigNumber.maximum(temp, 0);
    }

    return updateBorrowLimitCents;
  }, [
    amount,
    asset.vToken.underlyingToken,
    userTotalBorrowBalanceCents,
    userTotalBorrowLimitCents,
  ]);

  const [dailyEarningsCents, hypotheticalDailyEarningCents] = useMemo(() => {
    let hypotheticalDailyEarningCentsValue;
    const hypotheticalAssets = [...assets];

    const yearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets,
    });

    const dailyEarningsCentsValue =
      yearlyEarningsCents && calculateDailyEarningsCents(yearlyEarningsCents);

    // Modify asset with hypotheticalBalance
    if (validAmount) {
      const hypotheticalAsset = {
        ...asset,
        supplyBalance: calculateNewBalance(asset.userSupplyBalanceTokens, amount),
      };
      const currentIndex = assets.findIndex(
        a =>
          a.vToken.underlyingToken.address.toLowerCase() ===
          asset.vToken.underlyingToken.address.toLowerCase(),
      );
      hypotheticalAssets.splice(currentIndex, 1, hypotheticalAsset);

      const hypotheticalYearlyEarningsCents = calculateYearlyEarningsForAssets({
        assets: hypotheticalAssets,
      });

      hypotheticalDailyEarningCentsValue =
        hypotheticalYearlyEarningsCents &&
        calculateDailyEarningsCents(hypotheticalYearlyEarningsCents);
    }
    return [dailyEarningsCentsValue, hypotheticalDailyEarningCentsValue];
  }, [amount, asset.vToken.underlyingToken.address, JSON.stringify(assets)]);

  return (
    <>
      <FormikTokenTextField
        data-testid={TEST_IDS.valueInput}
        name="amount"
        token={asset.vToken.underlyingToken}
        disabled={isTransactionLoading}
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

      {tokenInfo.map((info, index) => (
        <LabeledInlineContent
          css={styles.getRow({ isLast: index === tokenInfo.length - 1 })}
          className="info-row"
          {...info}
          key={info.label}
        />
      ))}

      <Delimiter css={styles.getRow({ isLast: true })} />

      <BorrowBalanceAccountHealth
        css={styles.getRow({ isLast: true })}
        borrowBalanceCents={userTotalBorrowBalanceCents.toNumber()}
        borrowLimitCents={
          hypotheticalBorrowLimitCents?.toNumber() || userTotalBorrowLimitCents.toNumber()
        }
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      />

      <LabeledInlineContent
        label={t('supplyWithdraw.supplyBalance', {
          tokenSymbol: asset.vToken.underlyingToken.symbol,
        })}
        css={styles.getRow({ isLast: false })}
        className="info-row"
      >
        <ValueUpdate
          original={asset.userSupplyBalanceTokens}
          update={hypotheticalTokenSupplyBalance}
          format={(value: BigNumber | undefined) =>
            formatTokensToReadableValue({
              value,
              token: asset.vToken.underlyingToken,
              minimizeDecimals: true,
              addSymbol: false,
            })
          }
        />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('supplyWithdraw.borrowLimit')}
        css={styles.getRow({ isLast: false })}
        className="info-row"
      >
        <ValueUpdate original={userTotalBorrowLimitCents} update={hypotheticalBorrowLimitCents} />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('supplyWithdraw.dailyEarnings')}
        css={styles.getRow({ isLast: true })}
        className="info-row"
      >
        <ValueUpdate original={dailyEarningsCents} update={hypotheticalDailyEarningCents} />
      </LabeledInlineContent>

      <FormikSubmitButton
        fullWidth
        data-testid={TEST_IDS.submitButton}
        disabled={!validAmount}
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

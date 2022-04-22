/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { FormikProps } from 'formik';
import { Typography } from '@mui/material';
import { FormValues } from 'containers/AmountForm/validationSchema';
import { AmountForm, IAmountFormProps } from 'containers/AmountForm';
import {
  TokenTextField,
  Delimiter,
  LabeledInlineContent,
  ILabeledInlineContentProps,
  PrimaryButton,
  ProgressBarHorizontal,
  Tooltip,
  ValueUpdate,
} from 'components';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import {
  getBigNumber,
  convertWeiToCoins,
  formatCentsToReadableValue,
  format,
  currencyFormatter,
} from 'utilities/common';
import { useStyles } from '../styles';

interface ISupplyWithdrawFormUiProps {
  asset: Asset;
  tokenInfo: ILabeledInlineContentProps[];
  userTotalBorrowBalance: BigNumber;
  userTotalBorrowLimit: BigNumber;
  dailyEarnings: BigNumber;
  inputLabel: string;
  enabledButtonKey: string;
  disabledButtonKey: string;
  maxInput: BigNumber;
  calculateNewBalance: (amount: BigNumber) => BigNumber;
  isTransactionLoading: boolean;
}

export const SupplyWithdrawContent: React.FC<
  ISupplyWithdrawFormUiProps & FormikProps<FormValues>
> = ({
  values,
  setFieldValue,
  asset,
  tokenInfo,
  userTotalBorrowBalance,
  userTotalBorrowLimit,
  dailyEarnings,
  maxInput,
  inputLabel,
  enabledButtonKey,
  disabledButtonKey,
  calculateNewBalance,
  isTransactionLoading,
}) => {
  const { id: assetId } = asset;
  const { amount: amountString } = values;
  const amount = new BigNumber(amountString || 0);
  const validAmount = amount && !amount.isZero() && !amount.isNaN();
  const styles = useStyles();
  const { t, Trans } = useTranslation();
  const [newBorrowLimit, newBorrowPercent] = useMemo(() => {
    const tokenPrice = getBigNumber(asset?.tokenPrice);
    const collateralFactor = getBigNumber(asset?.collateralFactor);
    let updateBorrowLimit;
    let updateBorrowPercent = userTotalBorrowBalance.div(userTotalBorrowLimit).times(100);
    if (tokenPrice && validAmount) {
      const amountInUsd = convertWeiToCoins({
        value: amount as BigNumber,
        tokenId: asset.id,
      })
        .times(tokenPrice)
        .times(collateralFactor);
      const temp = calculateNewBalance(amountInUsd);
      updateBorrowLimit = BigNumber.maximum(temp, 0);
      updateBorrowPercent = userTotalBorrowBalance.div(temp).times(100);
    }
    return [updateBorrowLimit, updateBorrowPercent];
  }, [amount, asset?.id, userTotalBorrowBalance, userTotalBorrowLimit]);

  return (
    <>
      <TokenTextField
        name="amount"
        tokenId={assetId as TokenId}
        value={amountString}
        onChange={amt => setFieldValue('amount', amt, true)}
        max={maxInput.toString()}
        rightMaxButtonLabel={t('supplyWithdraw.max').toUpperCase()}
        css={styles.input}
      />
      <Typography component="span" variant="small1" css={styles.greyLabel}>
        <Trans
          i18nKey={inputLabel}
          components={{
            White: <Typography component="span" variant="small1" css={styles.whiteLabel} />,
          }}
          values={{ amount: format(maxInput), symbol: assetId?.toUpperCase() }}
        />
      </Typography>
      {tokenInfo.map(info => (
        <LabeledInlineContent
          css={styles.infoRow}
          className="info-row"
          {...info}
          key={info.label}
        />
      ))}
      <Delimiter />
      <div css={styles.progressSection}>
        <div css={styles.totalAndLimit}>
          <Tooltip
            placement="bottom"
            title={t('supplyWithdraw.currentBorrowBalance', {
              amount: currencyFormatter(userTotalBorrowBalance),
              percent: newBorrowPercent.toFixed(0),
            })}
          >
            <Typography component="span" variant="body1" css={styles.greyLabel}>
              <Trans
                i18nKey="supplyWithdraw.currentAmount"
                components={{
                  White: <Typography component="span" variant="body1" css={styles.whiteLabel} />,
                }}
                values={{ amount: currencyFormatter(userTotalBorrowBalance) }}
              />
            </Typography>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={t('supplyWithdraw.maxBorrowTooltip', {
              amount: currencyFormatter(userTotalBorrowLimit),
            })}
          >
            <Typography component="span" variant="body1" css={styles.greyLabel}>
              <Trans
                i18nKey="supplyWithdraw.maxAmount"
                components={{
                  White: <Typography component="span" variant="body1" css={styles.whiteLabel} />,
                }}
                values={{ amount: currencyFormatter(userTotalBorrowLimit) }}
              />
            </Typography>
          </Tooltip>
        </div>
        <ProgressBarHorizontal
          value={newBorrowPercent.toNumber()}
          // @TODO use SAFE_BORROW_LIMIT_PERCENTAGE constant
          mark={80}
          step={1}
          min={0}
          max={100}
          ariaLabel={t('supplyWithdraw.progressBarAria')}
          markTooltip={t('supplyWithdraw.safeBorrowLimit', { amount })}
        />
      </div>
      <LabeledInlineContent
        label={t('supplyWithdraw.borrowLimit')}
        css={[styles.infoRow, styles.borrowLimit]}
        className="info-row"
      >
        <ValueUpdate original={userTotalBorrowLimit} update={newBorrowLimit} />
      </LabeledInlineContent>
      <Delimiter />
      {/* @TODO add daily earnings calculations https://app.clickup.com/t/24quhp4 */}
      <LabeledInlineContent
        label={t('supplyWithdraw.dailyEarnings')}
        css={[styles.infoRow, styles.dailyEarnings]}
        className="info-row"
      >
        {formatCentsToReadableValue({ value: dailyEarnings })}
      </LabeledInlineContent>
      <LabeledInlineContent
        label={t('supplyWithdraw.supplyBalance')}
        css={[styles.infoRow, styles.bottomInfo]}
        className="info-row"
      >
        {t('supplyWithdraw.supplyBalanceValue', {
          amount: format(asset.supplyBalance),
          symbol: asset.symbol,
        })}
      </LabeledInlineContent>
      <PrimaryButton fullWidth disabled={!validAmount} type="submit" loading={isTransactionLoading}>
        {validAmount ? enabledButtonKey : disabledButtonKey}
      </PrimaryButton>
    </>
  );
};

interface ISupplyWithdrawFormProps extends ISupplyWithdrawFormUiProps {
  onSubmit: IAmountFormProps['onSubmit'];
}

const SupplyWithdrawForm: React.FC<ISupplyWithdrawFormProps> = ({ onSubmit, ...props }) => (
  <AmountForm onSubmit={onSubmit}>
    {formikBag => <SupplyWithdrawContent {...props} {...formikBag} />}
  </AmountForm>
);

export default SupplyWithdrawForm;

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
  BorrowBalanceAccountHealth,
  ValueUpdate,
} from 'components';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import {
  getBigNumber,
  convertWeiToCoins,
  formatCentsToReadableValue,
  format,
} from 'utilities/common';
import { useStyles } from '../styles';

interface ISupplyWithdrawFormUiProps {
  asset: Asset;
  tokenInfo: ILabeledInlineContentProps[];
  userTotalBorrowBalance: BigNumber;
  userTotalBorrowLimit: BigNumber;
  dailyEarningsCents: BigNumber;
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
  dailyEarningsCents,
  maxInput,
  inputLabel,
  enabledButtonKey,
  disabledButtonKey,
  calculateNewBalance,
  isTransactionLoading,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const { id: assetId } = asset;
  const { amount: amountString } = values;
  const amount = new BigNumber(amountString || 0);
  const validAmount = amount && !amount.isZero() && !amount.isNaN();

  const [newBorrowLimit] = useMemo(() => {
    const tokenPrice = getBigNumber(asset?.tokenPrice);
    const collateralFactor = getBigNumber(asset?.collateralFactor);
    let updateBorrowLimit;

    if (tokenPrice && validAmount) {
      const amountInUsd = convertWeiToCoins({
        value: amount as BigNumber,
        tokenId: asset.id,
      })
        .times(tokenPrice)
        .times(collateralFactor);

      const temp = calculateNewBalance(amountInUsd);
      updateBorrowLimit = BigNumber.maximum(temp, 0);
    }

    return [updateBorrowLimit];
  }, [amount, asset?.id, userTotalBorrowBalance, userTotalBorrowLimit]);

  return (
    <>
      <TokenTextField
        name="amount"
        tokenId={assetId as TokenId}
        value={amountString}
        onChange={amt => setFieldValue('amount', amt, true)}
        max={maxInput.toFixed()}
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

      <BorrowBalanceAccountHealth
        css={styles.progressSection}
        borrowBalanceCents={userTotalBorrowBalance.toNumber()}
        borrowLimitCents={userTotalBorrowLimit.toNumber()}
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      />

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
        {formatCentsToReadableValue({ value: dailyEarningsCents })}
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

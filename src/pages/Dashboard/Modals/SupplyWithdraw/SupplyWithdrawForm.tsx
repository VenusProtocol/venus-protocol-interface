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
  formatCentsToReadableValue,
  format,
  convertCoinsToWei,
} from 'utilities/common';
import { calculateCollateralValue } from 'utilities';
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
  const userTotalBorrowBalanceCents = userTotalBorrowBalance.multipliedBy(100);
  const userTotalBorrowLimitCents = userTotalBorrowLimit.multipliedBy(100);

  const [newBorrowLimit] = useMemo(() => {
    const tokenPrice = getBigNumber(asset?.tokenPrice);
    let updateBorrowLimit;

    if (tokenPrice && validAmount) {
      const amountInUsd = calculateCollateralValue({
        amountWei: convertCoinsToWei({ value: amount, tokenId: asset.id }),
        asset,
      });
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
        rightMaxButton={{
          label: t('supplyWithdraw.max').toUpperCase(),
          valueOnClick: maxInput.toFixed(),
        }}
        css={styles.input}
      />
      <Typography
        component="div"
        variant="small1"
        css={[styles.greyLabel, styles.getRow({ isLast: true })]}
      >
        <Trans
          i18nKey={inputLabel}
          components={{
            White: <Typography component="span" variant="small1" css={styles.whiteLabel} />,
          }}
          values={{ amount: format(maxInput), symbol: assetId?.toUpperCase() }}
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
        borrowLimitCents={userTotalBorrowLimitCents.toNumber()}
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      />

      <LabeledInlineContent
        label={t('supplyWithdraw.borrowLimit')}
        css={styles.getRow({ isLast: true })}
        className="info-row"
      >
        <ValueUpdate original={userTotalBorrowLimit} update={newBorrowLimit} />
      </LabeledInlineContent>
      <Delimiter css={styles.getRow({ isLast: true })} />
      <LabeledInlineContent
        label={t('supplyWithdraw.dailyEarnings')}
        css={styles.getRow({ isLast: false })}
        className="info-row"
      >
        {formatCentsToReadableValue({ value: dailyEarningsCents })}
      </LabeledInlineContent>
      <LabeledInlineContent
        label={t('supplyWithdraw.supplyBalance')}
        css={styles.bottomRow}
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

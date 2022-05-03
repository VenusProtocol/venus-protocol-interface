/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@mui/material';
import toast from 'components/Basic/Toast';
import { AmountForm, IAmountFormProps, ErrorCode } from 'containers/AmountForm';
import {
  FormikTokenTextField,
  Delimiter,
  LabeledInlineContent,
  ILabeledInlineContentProps,
  FormikSubmitButton,
  BorrowBalanceAccountHealth,
  ValueUpdate,
} from 'components';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import { getBigNumber, format, convertCoinsToWei } from 'utilities/common';
import {
  calculateYearlyEarningsForAssets,
  calculateDailyEarningsCents,
  calculateCollateralValue,
} from 'utilities';
import { useStyles } from '../styles';

interface ISupplyWithdrawFormUiProps {
  asset: Asset;
  assets: Asset[];
  tokenInfo: ILabeledInlineContentProps[];
  userTotalBorrowBalance: BigNumber;
  userTotalBorrowLimit: BigNumber;
  inputLabel: string;
  enabledButtonKey: string;
  disabledButtonKey: string;
  maxInput: BigNumber;
  calculateNewBalance: (initial: BigNumber, amount: BigNumber) => BigNumber;
  isTransactionLoading: boolean;
  isXvsEnabled: boolean;
  amountValue: string;
}

export const SupplyWithdrawContent: React.FC<ISupplyWithdrawFormUiProps> = ({
  asset,
  tokenInfo,
  userTotalBorrowBalance,
  userTotalBorrowLimit,
  assets,
  maxInput,
  inputLabel,
  enabledButtonKey,
  disabledButtonKey,
  calculateNewBalance,
  isTransactionLoading,
  isXvsEnabled,
  amountValue,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();
  const { id: assetId } = asset;
  const amount = new BigNumber(amountValue || 0);
  const validAmount = amount && !amount.isZero() && !amount.isNaN();
  const userTotalBorrowBalanceCents = userTotalBorrowBalance.multipliedBy(100);
  const userTotalBorrowLimitCents = userTotalBorrowLimit.multipliedBy(100);

  const hypotheticalBorrowLimitCents = useMemo(() => {
    const tokenPrice = getBigNumber(asset?.tokenPrice);
    let updateBorrowLimit;

    if (tokenPrice && validAmount) {
      const amountInUsd = calculateCollateralValue({
        amountWei: convertCoinsToWei({ value: amount, tokenId: asset.id }),
        asset,
      });
      const temp = calculateNewBalance(userTotalBorrowLimit, amountInUsd);
      updateBorrowLimit = BigNumber.maximum(temp, 0);
    }
    const updateBorrowLimitCents = updateBorrowLimit?.multipliedBy(100);
    return updateBorrowLimitCents;
  }, [amount, asset?.id, userTotalBorrowBalance, userTotalBorrowLimit]);

  const [dailyEarningsCents, hypotheticalDailyEarningCents] = useMemo(() => {
    let hypotheticalDailyEarningCentsValue;
    const hypotheticalAssets = [...assets];
    const yearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets,
      isXvsEnabled,
    });
    const dailyEarningsCentsValue =
      yearlyEarningsCents && calculateDailyEarningsCents(yearlyEarningsCents);

    // Modify asset with hypotheticalBalance
    if (validAmount) {
      const hypotheticalAsset = {
        ...asset,
        supplyBalance: calculateNewBalance(asset.supplyBalance, amount),
      };
      const currentIndex = assets.findIndex(a => a.id === asset.id);
      hypotheticalAssets.splice(currentIndex, 1, hypotheticalAsset);
      const hypotheticalYearlyEarningsCents = calculateYearlyEarningsForAssets({
        assets: hypotheticalAssets,
        isXvsEnabled,
      });
      hypotheticalDailyEarningCentsValue =
        hypotheticalYearlyEarningsCents &&
        calculateDailyEarningsCents(hypotheticalYearlyEarningsCents);
    }
    return [dailyEarningsCentsValue, hypotheticalDailyEarningCentsValue];
  }, [amount, asset.id, isXvsEnabled, JSON.stringify(assets)]);

  return (
    <>
      <FormikTokenTextField
        name="amount"
        tokenId={assetId as TokenId}
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
        borrowLimitCents={
          hypotheticalBorrowLimitCents?.toNumber() || userTotalBorrowLimitCents.toNumber()
        }
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      />

      <LabeledInlineContent
        label={t('supplyWithdraw.borrowLimit')}
        css={styles.getRow({ isLast: true })}
        className="info-row"
      >
        <ValueUpdate original={userTotalBorrowLimitCents} update={hypotheticalBorrowLimitCents} />
      </LabeledInlineContent>
      <Delimiter css={styles.getRow({ isLast: true })} />
      <LabeledInlineContent
        label={t('supplyWithdraw.dailyEarnings')}
        css={styles.getRow({ isLast: false })}
        className="info-row"
      >
        <ValueUpdate original={dailyEarningsCents} update={hypotheticalDailyEarningCents} />
      </LabeledInlineContent>
      <LabeledInlineContent
        label={t('supplyWithdraw.supplyBalance')}
        css={styles.bottomRow}
        className="info-row"
      >
        {t('supplyWithdraw.supplyBalanceValue', {
          amount: format(calculateNewBalance(asset.supplyBalance, amount)),
          symbol: asset.symbol,
        })}
      </LabeledInlineContent>
      <FormikSubmitButton
        fullWidth
        disabled={!validAmount}
        loading={isTransactionLoading}
        enabledLabel={enabledButtonKey}
        disabledLabel={disabledButtonKey}
      />
    </>
  );
};

interface ISupplyWithdrawFormProps extends Omit<ISupplyWithdrawFormUiProps, 'amountValue'> {
  onSubmit: IAmountFormProps['onSubmit'];
}

const SupplyWithdrawForm: React.FC<ISupplyWithdrawFormProps> = ({
  onSubmit,
  maxInput,
  ...props
}) => {
  const onSubmitHandleError: IAmountFormProps['onSubmit'] = async (value: string) => {
    try {
      await onSubmit(value);
    } catch (err) {
      toast.error({ title: (err as Error).message });
    }
  };
  return (
    <AmountForm onSubmit={onSubmitHandleError} maxAmount={maxInput.toFixed()}>
      {({ values }) => (
        <SupplyWithdrawContent maxInput={maxInput} amountValue={values.amount} {...props} />
      )}
    </AmountForm>
  );
};

export default SupplyWithdrawForm;

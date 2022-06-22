/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@mui/material';
import {
  toast,
  FormikTokenTextField,
  Delimiter,
  LabeledInlineContent,
  ILabeledInlineContentProps,
  FormikSubmitButton,
  BorrowBalanceAccountHealth,
  ValueUpdate,
} from 'components';
import { AmountForm, IAmountFormProps, ErrorCode } from 'containers/AmountForm';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { useTranslation } from 'translation';
import { VError, formatVErrorToReadableString } from 'errors';
import { Asset, TokenId } from 'types';
import {
  getBigNumber,
  format,
  convertTokensToWei,
  formatTokensToReadableValue,
  calculateYearlyEarningsForAssets,
  calculateDailyEarningsCents,
  calculateCollateralValue,
} from 'utilities';
import { useDailyXvsWei } from 'hooks/useDailyXvsWei';
import { useStyles } from '../styles';

interface ISupplyWithdrawFormUiProps {
  asset: Asset;
  assets: Asset[];
  type: 'supply' | 'withdraw';
  tokenInfo: ILabeledInlineContentProps[];
  maxInput: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalBorrowLimitCents: BigNumber;
  inputLabel: string;
  enabledButtonKey: string;
  disabledButtonKey: string;
  calculateNewBalance: (initial: BigNumber, amount: BigNumber) => BigNumber;
  isTransactionLoading: boolean;
  isXvsEnabled: boolean;
  amountValue: string;
}

export const SupplyWithdrawContent: React.FC<ISupplyWithdrawFormUiProps> = ({
  asset,
  type,
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
  isXvsEnabled,
  amountValue,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();
  const { id: assetId } = asset;
  const amount = new BigNumber(amountValue || 0);
  const validAmount = amount && !amount.isZero() && !amount.isNaN();

  const hypotheticalTokenSupplyBalance = amountValue
    ? calculateNewBalance(asset.supplyBalance, amount)
    : undefined;

  // TODO: handle loading state
  const { dailyXvsDistributionInterestsCents } = useDailyXvsWei();

  const hypotheticalBorrowLimitCents = useMemo(() => {
    const tokenPrice = getBigNumber(asset?.tokenPrice);
    let updateBorrowLimitCents;

    if (tokenPrice && validAmount) {
      const amountInCents = calculateCollateralValue({
        amountWei: convertTokensToWei({ value: amount, tokenId: asset.id }),
        tokenId: asset.id,
        tokenPriceTokens: asset.tokenPrice,
        collateralFactor: asset.collateralFactor,
      }).times(100);

      const temp = calculateNewBalance(userTotalBorrowLimitCents, amountInCents);
      updateBorrowLimitCents = BigNumber.maximum(temp, 0);
    }

    return updateBorrowLimitCents;
  }, [amount, asset?.id, userTotalBorrowBalanceCents, userTotalBorrowLimitCents]);

  const [dailyEarningsCents, hypotheticalDailyEarningCents] = useMemo(() => {
    let hypotheticalDailyEarningCentsValue;
    const hypotheticalAssets = [...assets];
    const yearlyEarningsCents =
      dailyXvsDistributionInterestsCents &&
      calculateYearlyEarningsForAssets({
        assets,
        isXvsEnabled,
        dailyXvsDistributionInterestsCents,
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
      const hypotheticalYearlyEarningsCents =
        dailyXvsDistributionInterestsCents &&
        calculateYearlyEarningsForAssets({
          assets: hypotheticalAssets,
          isXvsEnabled,
          dailyXvsDistributionInterestsCents,
        });
      hypotheticalDailyEarningCentsValue =
        hypotheticalYearlyEarningsCents &&
        calculateDailyEarningsCents(hypotheticalYearlyEarningsCents);
    }
    return [dailyEarningsCentsValue, hypotheticalDailyEarningCentsValue];
  }, [amount, asset.id, isXvsEnabled, JSON.stringify(assets)]);

  // Prevent users from supplying LUNA tokens. This is a temporary hotfix
  // following the crash of the LUNA token
  const isSupplyingLuna = type === 'supply' && asset.id === 'luna';

  return (
    <>
      <FormikTokenTextField
        name="amount"
        tokenId={assetId as TokenId}
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
          values={{ amount: format(maxInput, asset.decimals), symbol: assetId?.toUpperCase() }}
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
        <ValueUpdate
          original={asset.supplyBalance}
          update={hypotheticalTokenSupplyBalance}
          format={(value: BigNumber | undefined) =>
            formatTokensToReadableValue({
              value,
              tokenId: asset.id,
              minimizeDecimals: true,
            })
          }
        />
      </LabeledInlineContent>
      <FormikSubmitButton
        fullWidth
        disabled={!validAmount || isSupplyingLuna}
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
        <SupplyWithdrawContent maxInput={maxInput} amountValue={values.amount} {...props} />
      )}
    </AmountForm>
  );
};

export default SupplyWithdrawForm;

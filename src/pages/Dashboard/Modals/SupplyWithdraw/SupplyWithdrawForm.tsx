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
import { Asset, TokenId } from 'types';
import {
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
  convertTokensToWei,
  formatTokensToReadableValue,
  getBigNumber,
  getToken,
} from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';
import { useDailyXvsWei } from 'hooks/useDailyXvsWei';

import { useStyles } from '../styles';

interface SupplyWithdrawFormUiProps {
  asset: Asset;
  assets: Asset[];
  type: 'supply' | 'withdraw';
  tokenInfo: LabeledInlineContentProps[];
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

export const SupplyWithdrawContent: React.FC<SupplyWithdrawFormUiProps> = ({
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

  const token = getToken(assetId);

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
          values={{
            amount: formatTokensToReadableValue({
              value: maxInput,
              tokenId: asset.id,
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
        label={t('supplyWithdraw.supplyBalance', { tokenSymbol: token.symbol })}
        css={styles.getRow({ isLast: true })}
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
              addSymbol: false,
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

interface SupplyWithdrawFormProps extends Omit<SupplyWithdrawFormUiProps, 'amountValue'> {
  onSubmit: AmountFormProps['onSubmit'];
}

const SupplyWithdrawForm: React.FC<SupplyWithdrawFormProps> = ({
  onSubmit,
  maxInput,
  ...props
}) => {
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
        <SupplyWithdrawContent maxInput={maxInput} amountValue={values.amount} {...props} />
      )}
    </AmountForm>
  );
};

export default SupplyWithdrawForm;

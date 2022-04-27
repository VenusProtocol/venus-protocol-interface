/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import { FormikProps } from 'formik';
import BigNumber from 'bignumber.js';

import { getToken } from 'utilities';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset } from 'types';
import { AuthContext } from 'context/AuthContext';
import { AmountForm, FormValues, ErrorCode } from 'containers/AmountForm';
import { formatToReadablePercentage, formatApy } from 'utilities/common';
import calculatePercentage from 'utilities/calculatePercentage';
import calculateDailyEarningsCentsUtil from 'utilities/calculateDailyEarningsCents';
import { calculateYearlyEarningsForAssets } from 'utilities/calculateYearlyEarnings';
import { useUserMarketInfo } from 'clients/api';
import {
  PrimaryButton,
  TokenTextField,
  AccountHealth,
  LabeledInlineContent,
  ValueUpdate,
  Delimiter,
  Icon,
  ConnectWallet,
  EnableToken,
} from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../../styles';
import { useStyles as useBorrowStyles } from './styles';

export interface IBorrowUiProps
  extends Pick<
    FormikProps<FormValues>,
    'values' | 'setFieldValue' | 'handleBlur' | 'dirty' | 'isValid' | 'errors'
  > {
  asset: Asset;
  safeBorrowLimitPercentage: number;
  safeBorrowLimitCoins: string;
  totalBorrowBalanceCents: BigNumber;
  borrowLimitCents: BigNumber;
  calculateDailyEarningsCents: (tokenAmount: BigNumber) => BigNumber;
}

export const BorrowUi: React.FC<IBorrowUiProps> = ({
  asset,
  values,
  setFieldValue,
  handleBlur,
  dirty,
  errors,
  isValid,
  safeBorrowLimitPercentage,
  safeBorrowLimitCoins,
  totalBorrowBalanceCents,
  borrowLimitCents,
  calculateDailyEarningsCents,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useStyles();
  const borrowStyles = useBorrowStyles();
  const styles = {
    ...sharedStyles,
    ...borrowStyles,
  };

  const isAmountValid = values.amount && +values.amount > 0;
  const hypotheticalTotalBorrowBalanceCents = isAmountValid
    ? totalBorrowBalanceCents.plus(
        asset.tokenPrice
          .multipliedBy(values.amount)
          // Convert dollars to cents
          .multipliedBy(100),
      )
    : undefined;

  const borrowLimitUsedPercentage = React.useMemo(
    () =>
      calculatePercentage({
        numerator: totalBorrowBalanceCents.toNumber(),
        denominator: borrowLimitCents.toNumber(),
      }),
    [totalBorrowBalanceCents.toNumber(), borrowLimitCents.toNumber()],
  );

  const hypotheticalBorrowLimitUsedPercentage =
    hypotheticalTotalBorrowBalanceCents &&
    calculatePercentage({
      numerator: hypotheticalTotalBorrowBalanceCents.toNumber(),
      denominator: borrowLimitCents.toNumber(),
    });

  const dailyEarningsCents = React.useMemo(() => calculateDailyEarningsCents(new BigNumber(0)), []);
  const hypotheticalDailyEarningsCents = isAmountValid
    ? calculateDailyEarningsCents(new BigNumber(values.amount))
    : undefined;

  const readableBorrowApy = React.useMemo(
    () => formatToReadablePercentage(asset.borrowApy.toFixed(2)),
    [asset.borrowApy.toFixed()],
  );
  const readableDistributionApy = React.useMemo(
    () => formatToReadablePercentage(asset.xvsBorrowApy.toFixed(2)),
    [asset.xvsBorrowApy.toFixed()],
  );

  const canSubmit =
    isValid &&
    dirty &&
    typeof hypotheticalBorrowLimitUsedPercentage === 'number' &&
    hypotheticalBorrowLimitUsedPercentage <= 100;

  return (
    <>
      <div css={styles.getRow({ isLast: true })}>
        <TokenTextField
          name="amount"
          tokenId={asset.id}
          value={values.amount}
          onChange={amount => setFieldValue('amount', amount, true)}
          onBlur={handleBlur}
          rightMaxButton={{
            label: t('borrowRepayModal.borrow.rightMaxButtonLabel', {
              limitPercentage: safeBorrowLimitPercentage,
            }),
            valueOnClick: safeBorrowLimitCoins,
          }}
          data-testid="token-text-field"
          // Only display error state if amount is higher than borrow limit
          hasError={errors.amount === ErrorCode.HIGHER_THAN_MAX}
        />

        {+values.amount > +safeBorrowLimitCoins && (
          <div css={styles.liquidationWarning}>
            <Icon name="info" css={styles.liquidationWarningIcon} />

            <Typography variant="small2" css={styles.whiteLabel}>
              {t('borrowRepayModal.borrow.highAmountWarning')}
            </Typography>
          </div>
        )}
      </div>

      <AccountHealth
        borrowBalanceCents={totalBorrowBalanceCents.toNumber()}
        borrowLimitCents={borrowLimitCents.toNumber()}
        hypotheticalBorrowBalanceCents={hypotheticalTotalBorrowBalanceCents?.toNumber()}
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
        css={styles.getRow({ isLast: true })}
      />

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowLimitUsed')}
        css={styles.getRow({ isLast: false })}
      >
        <ValueUpdate
          original={borrowLimitUsedPercentage}
          update={hypotheticalBorrowLimitUsedPercentage}
          positiveDirection="desc"
          format={formatToReadablePercentage}
        />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowBalance')}
        css={styles.getRow({ isLast: true })}
      >
        <ValueUpdate
          original={totalBorrowBalanceCents.toNumber()}
          update={hypotheticalTotalBorrowBalanceCents?.toNumber()}
          positiveDirection="desc"
        />
      </LabeledInlineContent>

      <Delimiter css={styles.getRow({ isLast: true })} />

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowAPy')}
        iconName={asset.id}
        css={styles.getRow({ isLast: false })}
      >
        {readableBorrowApy}
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.distributionAPy')}
        iconName="xvs"
        css={styles.getRow({ isLast: true })}
      >
        {readableDistributionApy}
      </LabeledInlineContent>

      <Delimiter css={styles.getRow({ isLast: true })} />

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.dailyEarnings')}
        css={styles.bottomRow}
      >
        <ValueUpdate
          original={dailyEarningsCents.toNumber()}
          update={hypotheticalDailyEarningsCents?.toNumber()}
        />
      </LabeledInlineContent>

      <PrimaryButton type="submit" disabled={!canSubmit} fullWidth>
        {canSubmit
          ? t('borrowRepayModal.borrow.submitButton')
          : t('borrowRepayModal.borrow.submitButtonDisabled')}
      </PrimaryButton>
    </>
  );
};

export interface IBorrowProps {
  asset: Asset;
}

const Borrow: React.FC<IBorrowProps> = ({ asset }) => {
  const { t } = useTranslation();
  const { account } = React.useContext(AuthContext);

  const { assets, userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    accountAddress: account?.address,
  });

  // Convert dollar values to cents
  const totalBorrowBalanceCents = userTotalBorrowBalance.multipliedBy(100);
  const borrowLimitCents = userTotalBorrowLimit.multipliedBy(100);

  const calculateDailyEarningsCents: IBorrowUiProps['calculateDailyEarningsCents'] =
    tokenAmount => {
      const updatedAssets = assets.map(assetData => ({
        ...assetData,
        borrowBalance:
          assetData.id === asset.id
            ? assetData.borrowBalance.plus(tokenAmount)
            : assetData.borrowBalance,
      }));

      const { yearlyEarningsCents } = calculateYearlyEarningsForAssets({
        assets: updatedAssets,
        borrowBalanceCents: totalBorrowBalanceCents,
        isXvsEnabled: true,
      });

      return yearlyEarningsCents
        ? calculateDailyEarningsCentsUtil(yearlyEarningsCents)
        : new BigNumber(0);
    };

  // @TODO: send borrow request
  const handleSubmit = (amountTokens: string) => {
    console.log(amountTokens);
  };

  // Calculate maximum and safe maximum amount of coins user can borrow
  const [maxAmountCoins, safeBorrowLimitCoins] = React.useMemo(() => {
    const safeBorrowLimitCents = borrowLimitCents.multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE / 100);
    const marginWithBorrowLimitCents = borrowLimitCents.minus(totalBorrowBalanceCents);
    const marginWithSafeBorrowLimitCents = safeBorrowLimitCents.minus(totalBorrowBalanceCents);

    const tokenDecimals = getToken(asset.id).decimals;
    const formatValue = (value: BigNumber) => value.toFixed(tokenDecimals, BigNumber.ROUND_DOWN);

    const maxCoins = marginWithBorrowLimitCents
      // Convert cents to dollars
      .dividedBy(100)
      // Convert dollars to coins
      .dividedBy(asset.tokenPrice);

    const safeMaxCoins = marginWithSafeBorrowLimitCents
      // Convert cents to dollars
      .dividedBy(100)
      // Convert dollars to coins
      .dividedBy(asset.tokenPrice);

    return [formatValue(maxCoins), formatValue(safeMaxCoins)];
  }, [asset.id, asset.tokenPrice, borrowLimitCents.toFixed(), totalBorrowBalanceCents.toFixed()]);

  return (
    <ConnectWallet message={t('borrowRepayModal.borrow.connectWalletMessage')}>
      {asset && (
        <EnableToken
          symbol={asset.id}
          title={t('borrowRepayModal.borrow.enableToken.title', { symbol: asset.symbol })}
          tokenInfo={[
            {
              label: t('borrowRepayModal.borrow.enableToken.borrowInfo'),
              iconName: asset.id,
              children: formatApy(asset.borrowApy),
            },
            {
              label: t('borrowRepayModal.borrow.enableToken.distributionInfo'),
              iconName: 'xvs',
              children: formatApy(asset.xvsBorrowApy),
            },
          ]}
          isEnabled={asset.isEnabled}
          vtokenAddress={asset.vtokenAddress}
        >
          <AmountForm onSubmit={handleSubmit} maxAmount={maxAmountCoins}>
            {({ values, setFieldValue, handleBlur, dirty, isValid, errors }) => (
              <BorrowUi
                asset={asset}
                totalBorrowBalanceCents={totalBorrowBalanceCents}
                borrowLimitCents={borrowLimitCents}
                safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
                safeBorrowLimitCoins={safeBorrowLimitCoins}
                calculateDailyEarningsCents={calculateDailyEarningsCents}
                values={values}
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                dirty={dirty}
                isValid={isValid}
                errors={errors}
              />
            )}
          </AmountForm>
        </EnableToken>
      )}
    </ConnectWallet>
  );
};

export default Borrow;

/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  BorrowBalanceAccountHealth,
  Delimiter,
  LabeledInlineContent,
  ValueUpdate,
} from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  areTokensEqual,
  calculateDailyEarningsCents as calculateDailyEarningsCentsUtil,
  calculatePercentage,
  calculateYearlyEarningsForAssets,
  formatToReadablePercentage,
} from 'utilities';

import { useGetMainAssets } from 'clients/api';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

import { useStyles as useSharedStyles } from '../styles';

export interface AccountDataProps {
  asset: Asset;
  hypotheticalBorrowAmountTokens: number;
}

const AccountData: React.FC<AccountDataProps> = ({ asset, hypotheticalBorrowAmountTokens }) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const { account: { address: accountAddress = '' } = {} } = useContext(AuthContext);

  // TODO: handle loading state (see VEN-591)
  const { data: getMainAssetsData } = useGetMainAssets({
    accountAddress,
  });
  const hypotheticalTotalBorrowBalanceCents =
    hypotheticalBorrowAmountTokens !== 0
      ? (getMainAssetsData?.userTotalBorrowBalanceCents || new BigNumber(0)).plus(
          asset.tokenPriceDollars
            .multipliedBy(hypotheticalBorrowAmountTokens)
            // Convert dollars to cents
            .multipliedBy(100),
        )
      : undefined;

  const borrowLimitUsedPercentage = useMemo(
    () =>
      getMainAssetsData
        ? calculatePercentage({
            numerator: getMainAssetsData.userTotalBorrowBalanceCents.toNumber(),
            denominator: getMainAssetsData.userTotalBorrowLimitCents.toNumber(),
          })
        : 0,
    [
      getMainAssetsData?.userTotalBorrowBalanceCents,
      getMainAssetsData?.userTotalBorrowBalanceCents,
    ],
  );

  const hypotheticalBorrowLimitUsedPercentage =
    hypotheticalTotalBorrowBalanceCents &&
    getMainAssetsData?.userTotalBorrowLimitCents &&
    calculatePercentage({
      numerator: hypotheticalTotalBorrowBalanceCents.toNumber(),
      denominator: getMainAssetsData.userTotalBorrowLimitCents.toNumber(),
    });

  const calculateDailyEarningsCents = React.useCallback(
    (tokenAmount: BigNumber) => {
      const updatedAssets = (getMainAssetsData?.assets || []).map(assetData => ({
        ...assetData,
        userBorrowBalanceTokens: areTokensEqual(
          assetData.vToken.underlyingToken,
          asset.vToken.underlyingToken,
        )
          ? // TODO: fix. Currently wrong when repaying a loan (it should subtract
            // from the balance, not add to it)
            assetData.userBorrowBalanceTokens.plus(tokenAmount)
          : assetData.userBorrowBalanceTokens,
      }));

      const yearlyEarningsCents = calculateYearlyEarningsForAssets({
        assets: updatedAssets,
      });

      return yearlyEarningsCents && calculateDailyEarningsCentsUtil(yearlyEarningsCents);
    },
    [getMainAssetsData?.assets],
  );

  const dailyEarningsCents = calculateDailyEarningsCents(new BigNumber(0));
  const hypotheticalDailyEarningsCents =
    hypotheticalBorrowAmountTokens !== 0
      ? calculateDailyEarningsCents(new BigNumber(hypotheticalBorrowAmountTokens))
      : undefined;

  const readableBorrowApy = React.useMemo(
    () => formatToReadablePercentage(asset.borrowApyPercentage),
    [asset.borrowApyPercentage],
  );
  const readableDistributionApy = React.useMemo(
    () => formatToReadablePercentage(asset.xvsBorrowApy),
    [asset.xvsBorrowApy],
  );

  return (
    <>
      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowAPy')}
        iconSrc={asset.vToken.underlyingToken}
        css={sharedStyles.getRow({ isLast: false })}
      >
        {readableBorrowApy}
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.distributionApy')}
        iconSrc={TOKENS.xvs}
        css={sharedStyles.getRow({ isLast: true })}
      >
        {readableDistributionApy}
      </LabeledInlineContent>

      <Delimiter css={sharedStyles.getRow({ isLast: true })} />

      <BorrowBalanceAccountHealth
        borrowBalanceCents={getMainAssetsData?.userTotalBorrowBalanceCents.toNumber()}
        borrowLimitCents={getMainAssetsData?.userTotalBorrowLimitCents.toNumber()}
        hypotheticalBorrowBalanceCents={hypotheticalTotalBorrowBalanceCents?.toNumber()}
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
        css={sharedStyles.getRow({ isLast: true })}
      />

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowBalance')}
        css={sharedStyles.getRow({ isLast: false })}
      >
        <ValueUpdate
          original={getMainAssetsData?.userTotalBorrowBalanceCents.toNumber()}
          update={hypotheticalTotalBorrowBalanceCents?.toNumber()}
          positiveDirection="desc"
        />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowLimitUsed')}
        css={sharedStyles.getRow({ isLast: false })}
      >
        <ValueUpdate
          original={borrowLimitUsedPercentage}
          update={hypotheticalBorrowLimitUsedPercentage}
          positiveDirection="desc"
          format={formatToReadablePercentage}
        />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.dailyEarnings')}
        css={sharedStyles.getRow({ isLast: true })}
      >
        <ValueUpdate
          original={dailyEarningsCents?.toNumber()}
          update={hypotheticalDailyEarningsCents?.toNumber()}
        />
      </LabeledInlineContent>
    </>
  );
};

export default AccountData;

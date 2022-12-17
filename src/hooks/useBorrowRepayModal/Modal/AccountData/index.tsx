/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  BorrowBalanceAccountHealth,
  Delimiter,
  LabeledInlineContent,
  ValueUpdate,
} from 'components';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  calculateDailyEarningsCents as calculateDailyEarningsCentsUtil,
  calculatePercentage,
  calculateYearlyEarningsForAssets,
  formatToReadablePercentage,
} from 'utilities';

import { useGetUserMarketInfo } from 'clients/api';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

import { useStyles as useSharedStyles } from '../styles';

export interface AccountDataProps {
  asset: Asset;
  hypotheticalBorrowAmountTokens: number;
  includeXvs: boolean;
}

const AccountData: React.FC<AccountDataProps> = ({
  asset,
  hypotheticalBorrowAmountTokens,
  includeXvs,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const { account: { address: accountAddress = '' } = {} } = useContext(AuthContext);

  // TODO: handle loading state (see VEN-591)
  const {
    data: { assets, userTotalBorrowBalanceCents, userTotalBorrowLimitCents },
  } = useGetUserMarketInfo({
    accountAddress,
  });

  const hypotheticalTotalBorrowBalanceCents =
    hypotheticalBorrowAmountTokens !== 0
      ? userTotalBorrowBalanceCents.plus(
          asset.tokenPriceDollars
            .multipliedBy(hypotheticalBorrowAmountTokens)
            // Convert dollars to cents
            .multipliedBy(100),
        )
      : undefined;

  const borrowLimitUsedPercentage = React.useMemo(
    () =>
      calculatePercentage({
        numerator: userTotalBorrowBalanceCents.toNumber(),
        denominator: userTotalBorrowLimitCents.toNumber(),
      }),
    [userTotalBorrowBalanceCents.toNumber(), userTotalBorrowLimitCents.toNumber()],
  );

  const hypotheticalBorrowLimitUsedPercentage =
    hypotheticalTotalBorrowBalanceCents &&
    calculatePercentage({
      numerator: hypotheticalTotalBorrowBalanceCents.toNumber(),
      denominator: userTotalBorrowLimitCents.toNumber(),
    });

  const calculateDailyEarningsCents = React.useCallback(
    (tokenAmount: BigNumber) => {
      const updatedAssets = assets.map(assetData => ({
        ...assetData,
        borrowBalance:
          assetData.vToken.underlyingToken.address.toLowerCase() ===
          asset.vToken.underlyingToken.address.toLowerCase()
            ? assetData.borrowBalance.plus(tokenAmount)
            : assetData.borrowBalance,
      }));

      const yearlyEarningsCents = calculateYearlyEarningsForAssets({
        assets: updatedAssets,
        includeXvs,
      });

      return yearlyEarningsCents && calculateDailyEarningsCentsUtil(yearlyEarningsCents);
    },
    [JSON.stringify(assets)],
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
        borrowBalanceCents={userTotalBorrowBalanceCents.toNumber()}
        borrowLimitCents={userTotalBorrowLimitCents.toNumber()}
        hypotheticalBorrowBalanceCents={hypotheticalTotalBorrowBalanceCents?.toNumber()}
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
        css={sharedStyles.getRow({ isLast: true })}
      />

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.borrowBalance')}
        css={sharedStyles.getRow({ isLast: false })}
      >
        <ValueUpdate
          original={userTotalBorrowBalanceCents.toNumber()}
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

/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset } from 'types';
import { AuthContext } from 'context/AuthContext';
import { useGetUserMarketInfo } from 'clients/api';
import { formatToReadablePercentage } from 'utilities/common';
import calculateDailyEarningsCentsUtil from 'utilities/calculateDailyEarningsCents';
import { calculateYearlyEarningsForAssets } from 'utilities/calculateYearlyEarnings';
import calculatePercentage from 'utilities/calculatePercentage';
import {
  BorrowBalanceAccountHealth,
  LabeledInlineContent,
  ValueUpdate,
  Delimiter,
} from 'components';
import { useTranslation } from 'translation';
import { useVTokenDailyXvs } from 'hooks/useVTokenDailyXvs';
import { useStyles } from '../../styles';

export interface IAccountDataProps {
  asset: Asset;
  hypotheticalBorrowAmountTokens: number;
  isXvsEnabled: boolean;
}

const AccountData: React.FC<IAccountDataProps> = ({
  asset,
  hypotheticalBorrowAmountTokens,
  isXvsEnabled,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { account: { address: accountAddress = '' } = {} } = useContext(AuthContext);

  // TODO: handle loading state (see https://app.clickup.com/t/2d4rcee)
  const {
    data: { assets, userTotalBorrowBalanceCents, userTotalBorrowLimitCents },
  } = useGetUserMarketInfo({
    accountAddress,
  });

  const { dailyXvsDistributionInterestsCents } = useVTokenDailyXvs({ assets });

  const hypotheticalTotalBorrowBalanceCents =
    hypotheticalBorrowAmountTokens !== 0
      ? userTotalBorrowBalanceCents.plus(
          asset.tokenPrice
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
          assetData.id === asset.id
            ? assetData.borrowBalance.plus(tokenAmount)
            : assetData.borrowBalance,
      }));

      const yearlyEarningsCents = calculateYearlyEarningsForAssets({
        assets: updatedAssets,
        isXvsEnabled,
        dailyXvsDistributionInterestsCents,
      });

      return yearlyEarningsCents
        ? calculateDailyEarningsCentsUtil(yearlyEarningsCents)
        : new BigNumber(0);
    },
    [JSON.stringify(assets)],
  );

  const dailyEarningsCents = React.useMemo(() => calculateDailyEarningsCents(new BigNumber(0)), []);
  const hypotheticalDailyEarningsCents =
    hypotheticalBorrowAmountTokens !== 0
      ? calculateDailyEarningsCents(new BigNumber(hypotheticalBorrowAmountTokens))
      : undefined;

  const readableBorrowApy = React.useMemo(
    () => formatToReadablePercentage(asset.borrowApy.toFixed(2)),
    [asset.borrowApy.toFixed()],
  );
  const readableDistributionApy = React.useMemo(
    () => formatToReadablePercentage(asset.xvsBorrowApy.toFixed(2)),
    [asset.xvsBorrowApy.toFixed()],
  );

  return (
    <>
      <BorrowBalanceAccountHealth
        borrowBalanceCents={userTotalBorrowBalanceCents.toNumber()}
        borrowLimitCents={userTotalBorrowLimitCents.toNumber()}
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
          original={userTotalBorrowBalanceCents.toNumber()}
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
    </>
  );
};

export default AccountData;

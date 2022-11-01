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
import useDailyXvsDistributionInterests from 'hooks/useDailyXvsDistributionInterests';

import { useStyles } from '../../styles';

export interface AccountDataProps {
  asset: Asset;
  hypotheticalBorrowAmountTokens: number;
  isXvsEnabled: boolean;
}

const AccountData: React.FC<AccountDataProps> = ({
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

  // TODO: handle loading state
  const { dailyXvsDistributionInterestsCents } = useDailyXvsDistributionInterests();

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
          assetData.token.address === asset.token.address
            ? assetData.borrowBalance.plus(tokenAmount)
            : assetData.borrowBalance,
      }));

      const yearlyEarningsCents =
        dailyXvsDistributionInterestsCents &&
        calculateYearlyEarningsForAssets({
          assets: updatedAssets,
          isXvsEnabled,
          dailyXvsDistributionInterestsCents,
        });

      return yearlyEarningsCents && calculateDailyEarningsCentsUtil(yearlyEarningsCents);
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
        iconSrc={asset.token}
        css={styles.getRow({ isLast: false })}
      >
        {readableBorrowApy}
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.distributionApy')}
        iconSrc={TOKENS.xvs}
        css={styles.getRow({ isLast: true })}
      >
        {readableDistributionApy}
      </LabeledInlineContent>

      <Delimiter css={styles.getRow({ isLast: true })} />

      <LabeledInlineContent
        label={t('borrowRepayModal.borrow.dailyEarnings')}
        css={styles.getRow({ isLast: true })}
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

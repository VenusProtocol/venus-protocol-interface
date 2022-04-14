/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { formatCentsToReadableValue } from 'utilities/common';
import { IToggleProps, Toggle, Icon, ProgressBarHorizontal, Tooltip } from 'components';
import { AuthContext } from 'context/AuthContext';
import useUserMarketInfo from 'hooks/useUserMarketInfo';
import { useMyAccountStyles as useStyles } from './styles';

interface IMyAccountProps {
  netApyPercentage: number | undefined;
  dailyEarningsCents: number | undefined;
  supplyBalanceCents: number | undefined;
  borrowBalanceCents: number | undefined;
  borrowLimitCents: number | undefined;
  safeBorrowLimitPercentage: number;
  withXvs: boolean;
  onXvsToggle: (newValue: boolean) => void;
  className?: string;
}

export const MyAccountUi = ({
  netApyPercentage,
  dailyEarningsCents,
  supplyBalanceCents,
  borrowBalanceCents,
  borrowLimitCents,
  safeBorrowLimitPercentage,
  withXvs,
  onXvsToggle,
  className,
}: IMyAccountProps) => {
  const styles = useStyles();
  const handleXvsToggleChange: IToggleProps['onChange'] = (event, checked) => onXvsToggle(checked);

  const readableBorrowBalance =
    typeof borrowBalanceCents === 'number'
      ? formatCentsToReadableValue(borrowBalanceCents)
      : undefined;

  const borrowLimitUsedPercentage =
    typeof borrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
      ? Math.round((borrowBalanceCents * 100) / borrowLimitCents)
      : undefined;

  const readableBorrowLimitUsedPercentage = borrowLimitUsedPercentage
    ? `${borrowLimitUsedPercentage}%`
    : undefined;

  const safeBorrowLimitCents =
    typeof borrowLimitCents === 'number'
      ? Math.floor((borrowLimitCents * safeBorrowLimitPercentage) / 100)
      : undefined;

  const readableSafeBorrowLimit =
    typeof safeBorrowLimitCents === 'number'
      ? formatCentsToReadableValue(safeBorrowLimitCents, true)
      : undefined;

  return (
    <div css={styles.container} className={className}>
      <div css={[styles.row, styles.header]}>
        <Typography variant="h4">My account</Typography>

        <Typography component="div" variant="small2" css={styles.apyWithXvs}>
          {/* @TODO: update tooltip content */}
          <Tooltip css={styles.tooltip} title="tooltip content">
            <Icon css={styles.infoIcon} name="info" />
          </Tooltip>

          <Typography color="text.primary" variant="small1" css={styles.apyWithXvsLabel}>
            APY with XVS
          </Typography>

          <Toggle css={styles.toggle} value={withXvs} onChange={handleXvsToggleChange} />
        </Typography>
      </div>

      <div css={styles.netApyContainer}>
        <div css={styles.netApy}>
          <Typography component="div" variant="small2" css={styles.netApyLabel}>
            Net APY
          </Typography>

          {/* @TODO: update tooltip content */}
          <Tooltip css={styles.tooltip} title="tooltip content">
            <Icon css={styles.infoIcon} name="info" />
          </Tooltip>
        </div>

        <Typography variant="h1" color="interactive.success">
          {typeof netApyPercentage === 'number' ? `${netApyPercentage}%` : '-'}
        </Typography>
      </div>

      <ul css={styles.list}>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="div" variant="small2" css={styles.labelListItem}>
            Daily earnings
          </Typography>

          {typeof dailyEarningsCents === 'number'
            ? formatCentsToReadableValue(dailyEarningsCents)
            : '-'}
        </Typography>

        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="div" variant="small2" css={styles.labelListItem}>
            Supply balance
          </Typography>

          {typeof supplyBalanceCents === 'number'
            ? formatCentsToReadableValue(supplyBalanceCents)
            : '-'}
        </Typography>

        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="div" variant="small2" css={styles.labelListItem}>
            Borrow balance
          </Typography>

          {readableBorrowBalance || '-'}
        </Typography>
      </ul>

      <div css={[styles.row, styles.topProgressBarLegend]}>
        <div css={styles.inlineContainer}>
          <Typography component="span" variant="small2" css={styles.inlineLabel}>
            Borrow limit used:
          </Typography>

          <Typography component="span" variant="small1" color="text.primary">
            {readableBorrowLimitUsedPercentage || '-'}
          </Typography>
        </div>

        <div css={styles.inlineContainer}>
          <Typography component="span" variant="small2" css={styles.inlineLabel}>
            Limit:
          </Typography>

          <Typography component="span" variant="small1" color="text.primary">
            {typeof borrowLimitCents === 'number' &&
              formatCentsToReadableValue(borrowLimitCents, true)}
          </Typography>
        </div>
      </div>

      <ProgressBarHorizontal
        css={styles.progressBar}
        value={borrowLimitUsedPercentage || 0}
        mark={safeBorrowLimitPercentage}
        step={1}
        ariaLabel={t('myAccount.progressBar.ariaLabel')}
        min={0}
        max={100}
        trackTooltip={
          readableBorrowBalance &&
          readableBorrowLimitUsedPercentage && (
            <>
              Current borrow balance:
              <br />
              {readableBorrowBalance} ({readableBorrowLimitUsedPercentage} of your borrow limit)
            </>
          )
        }
        markTooltip={
          readableSafeBorrowLimit && (
            <>
              Safe borrow limit:
              <br />
              {readableSafeBorrowLimit} ({safeBorrowLimitPercentage}% of your borrow limit)
            </>
          )
        }
        isDisabled
      />

      <Typography component="div" variant="small2" css={styles.bottom}>
        <Icon name="shield" css={styles.shieldIcon} />

        <Typography component="span" variant="small2" css={styles.inlineLabel}>
          Your safe limit:
        </Typography>

        <Typography component="span" variant="small1" color="text.primary" css={styles.safeLimit}>
          {readableSafeBorrowLimit || '-'}
        </Typography>

        {/* @TODO: update tooltip content */}
        <Tooltip css={styles.tooltip} title="tooltip content">
          <Icon css={styles.infoIcon} name="info" />
        </Tooltip>
      </Typography>
    </div>
  );
};

const MyAccount: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const assets = useUserMarketInfo({ account: account?.address });

  // @TODO: elevate state so it can be shared with borrow and supply markets
  const [isXvsEnabled, setIsXvsEnabled] = React.useState(true);

  const uiProps: Pick<
    IMyAccountProps,
    | 'netApyPercentage'
    | 'dailyEarningsCents'
    | 'supplyBalanceCents'
    | 'borrowBalanceCents'
    | 'borrowLimitCents'
  > = React.useMemo(() => {
    let supplyBalanceCents: BigNumber | undefined;
    let borrowBalanceCents: BigNumber | undefined;
    let borrowLimitCents: BigNumber | undefined;

    // We use the yearly earnings to calculate the daily earnings the net APY
    let yearlyEarningsCents: BigNumber | undefined;

    assets.forEach(asset => {
      // Initialize values to 0. Note that we only initialize the values if at
      // least one asset has been fetched (we don't want to display zeros while
      // the query is loading or if a fetching error happens)
      if (!borrowBalanceCents) {
        borrowBalanceCents = new BigNumber(0);
      }

      if (!supplyBalanceCents) {
        supplyBalanceCents = new BigNumber(0);
      }

      if (!borrowLimitCents) {
        borrowLimitCents = new BigNumber(0);
      }

      if (!yearlyEarningsCents) {
        yearlyEarningsCents = new BigNumber(0);
      }

      borrowBalanceCents = borrowBalanceCents.plus(
        asset.borrowBalance.multipliedBy(asset.tokenPrice).multipliedBy(100),
      );

      supplyBalanceCents = supplyBalanceCents.plus(
        asset.supplyBalance.multipliedBy(asset.tokenPrice).multipliedBy(100),
      );

      // Update borrow limit if asset is currently enabled as collateral
      if (asset.collateral) {
        borrowLimitCents = borrowLimitCents.plus(
          supplyBalanceCents.multipliedBy(asset.collateralFactor),
        );
      }

      const supplyYearlyEarnings = supplyBalanceCents.multipliedBy(asset.supplyApy).dividedBy(100);
      // Note that borrowYearlyInterests will always be negative (or 0), since
      // the borrow APY is expressed with a negative percentage)
      const borrowYearlyInterests = borrowBalanceCents.multipliedBy(asset.borrowApy).dividedBy(100);

      yearlyEarningsCents = yearlyEarningsCents.plus(
        supplyYearlyEarnings.plus(borrowYearlyInterests),
      );

      // Add XVS distribution earnings if enabled
      if (isXvsEnabled) {
        const supplyDistributionYearlyEarnings = supplyBalanceCents
          .multipliedBy(asset.xvsSupplyApy)
          .dividedBy(100);
        const borrowDistributionYearlyEarnings = borrowBalanceCents
          .multipliedBy(asset.xvsBorrowApy)
          .dividedBy(100);

        yearlyEarningsCents = yearlyEarningsCents
          .plus(supplyDistributionYearlyEarnings)
          .plus(borrowDistributionYearlyEarnings);
      }
    });

    /*
    The net APY represents a percentage of the difference between the supply
    balance and the borrow balance.

    We first calculate the difference between the supply balance and the borrow
    balance: supplyBorrowDifference = supplyBalance - borrowBalance

    Then we calculate what percentage of that difference the yearly earnings
    represent: netApy = yearlyEarnings * 100 / supplyBorrowDifference
    */
    const supplyBorrowDifferenceCents =
      supplyBalanceCents && borrowBalanceCents && supplyBalanceCents.minus(borrowBalanceCents);

    const netApyPercentage =
      supplyBorrowDifferenceCents &&
      yearlyEarningsCents &&
      supplyBorrowDifferenceCents.isGreaterThan(0)
        ? +yearlyEarningsCents.multipliedBy(100).dividedBy(supplyBorrowDifferenceCents).toFixed(2)
        : undefined;

    const dailyEarningsCents =
      yearlyEarningsCents && +yearlyEarningsCents.dividedBy(365).toFixed(0);

    return {
      netApyPercentage,
      dailyEarningsCents,
      supplyBalanceCents: supplyBalanceCents?.toNumber(),
      borrowBalanceCents: borrowBalanceCents?.toNumber(),
      borrowLimitCents: borrowLimitCents && +borrowLimitCents.toFixed(0),
    };
  }, [JSON.stringify(assets), isXvsEnabled]);

  return (
    <MyAccountUi
      safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      withXvs={isXvsEnabled}
      onXvsToggle={setIsXvsEnabled}
      {...uiProps}
    />
  );
};

export default MyAccount;

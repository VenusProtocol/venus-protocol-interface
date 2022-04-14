/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
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
  safeLimitPercentage: number;
  className?: string;
}

export const MyAccountUi = ({
  netApyPercentage,
  dailyEarningsCents,
  supplyBalanceCents,
  borrowBalanceCents,
  borrowLimitCents,
  safeLimitPercentage,
  className,
}: IMyAccountProps) => {
  const styles = useStyles();
  // @TODO: update to use a shared state (or possibly speak with designers about
  // changing the designs, as it feels weird that this toggle would also update
  // the borrow and supply market tables)
  const [isToggleSwitched, setToggleSwitched] = useState(true);
  const handleSwitch: IToggleProps['onChange'] = (event, checked) => {
    setToggleSwitched(checked);
  };

  const borrowLimitUsedPercentage =
    typeof borrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
      ? Math.round((borrowBalanceCents * 100) / borrowLimitCents)
      : undefined;

  const safeLimitCents =
    typeof borrowLimitCents === 'number'
      ? Math.floor((borrowLimitCents * safeLimitPercentage) / 100)
      : undefined;

  return (
    <div css={styles.container} className={className}>
      <div css={[styles.row, styles.header]}>
        <Typography variant="h4">My account</Typography>

        <Typography component="div" variant="small2" css={styles.apyWithXvs}>
          {/* @TODO: update tooltip content */}
          <Tooltip css={styles.tooltip} title="tooltip content">
            <Icon css={styles.getInfoIcon({ position: 'left' })} name="info" />
          </Tooltip>

          <Typography color="text.primary" variant="small1">
            {t('myAccount.apyWithXvs')}
          </Typography>

          <Toggle css={styles.toggle} value={isToggleSwitched} onChange={handleSwitch} />
        </Typography>
      </div>

      <div css={styles.netApyContainer}>
        <Typography component="div" variant="small2" css={styles.netApyLabel}>
          Net APY
          {/* @TODO: update tooltip content */}
          <Tooltip css={styles.tooltip} title="tooltip content">
            <Icon css={styles.getInfoIcon({ position: 'right' })} name="info" />
          </Tooltip>
        </Typography>

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

          {typeof borrowBalanceCents === 'number'
            ? formatCentsToReadableValue(borrowBalanceCents)
            : '-'}
        </Typography>
      </ul>

      <div css={[styles.row, styles.topProgressBarLegend]}>
        <div css={styles.inlineContainer}>
          <Typography component="span" variant="small2" css={styles.inlineLabel}>
            Borrow limit used:
          </Typography>

          <Typography component="span" variant="small1" color="text.primary">
            {typeof borrowLimitUsedPercentage === 'number' && `${borrowLimitUsedPercentage}%`}
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
        mark={safeLimitPercentage}
        step={1}
        ariaLabel={t('myAccount.progressBar.ariaLabel')}
        min={0}
        max={100}
        trackTooltip="Storybook tooltip text for Track"
        markTooltip="Storybook tooltip text for Mark"
        isDisabled
      />

      <Typography component="div" variant="small2" css={styles.bottom}>
        <Icon name="shield" css={styles.shieldIcon} />

        <Typography component="span" variant="small2" css={styles.inlineLabel}>
          Your safe limit:
        </Typography>

        <Typography component="span" variant="small1" color="text.primary">
          {typeof safeLimitCents === 'number'
            ? formatCentsToReadableValue(safeLimitCents, true)
            : '-'}
        </Typography>

        {/* @TODO: update tooltip content */}
        <Tooltip css={styles.tooltip} title="tooltip content">
          <Icon css={styles.getInfoIcon({ position: 'right' })} name="info" />
        </Tooltip>
      </Typography>
    </div>
  );
};

const MyAccount: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const assets = useUserMarketInfo({ account: account?.address });

  const uiProps: Omit<IMyAccountProps, 'className' | 'safeLimitPercentage'> = React.useMemo(() => {
    let supplyBalanceCents: BigNumber | undefined;
    let borrowBalanceCents: BigNumber | undefined;
    let borrowLimitCents: BigNumber | undefined;
    let dailyEarningsCents: number | undefined;
    let netApyPercentage: number | undefined;

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

      if (!dailyEarningsCents) {
        dailyEarningsCents = 0;
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

      // @TODO: include XVS distribution APY if enabled
      yearlyEarningsCents = yearlyEarningsCents.plus(
        supplyYearlyEarnings.plus(borrowYearlyInterests),
      );
    });

    return {
      netApyPercentage,
      dailyEarningsCents: yearlyEarningsCents && +yearlyEarningsCents.dividedBy(365).toFixed(0),
      supplyBalanceCents: supplyBalanceCents?.toNumber(),
      borrowBalanceCents: borrowBalanceCents?.toNumber(),
      borrowLimitCents: borrowLimitCents && +borrowLimitCents.toFixed(0),
    };
  }, [JSON.stringify(assets)]);

  return <MyAccountUi safeLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE} {...uiProps} />;
};

export default MyAccount;

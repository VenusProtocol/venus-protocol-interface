/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';

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
  safeLimitPercentage: number | undefined;
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
    borrowBalanceCents && borrowLimitCents
      ? Math.round((borrowBalanceCents * 100) / borrowLimitCents)
      : 0;

  return (
    <div css={styles.container}>
      <div css={[styles.row, styles.header]}>
        <Typography variant="h4">My account</Typography>

        <Typography component="div" variant="small2" css={styles.apyWithXvs}>
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

          {formatCentsToReadableValue(dailyEarningsCents)}
        </Typography>

        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="div" variant="small2" css={styles.labelListItem}>
            Supply balance
          </Typography>

          {formatCentsToReadableValue(supplyBalanceCents)}
        </Typography>

        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="div" variant="small2" css={styles.labelListItem}>
            Borrow balance
          </Typography>

          {formatCentsToReadableValue(borrowBalanceCents)}
        </Typography>
      </ul>

      <div css={[styles.row, styles.topProgressBarLegend]}>
        <div css={styles.borrowLimitLabelWrapper}>
          <Typography component="span" variant="small2" css={styles.inlineLabel}>
            Borrow limit:
          </Typography>

          <Typography component="span" variant="small1" color="text.primary">
            {safeLimitPercentage}%
          </Typography>
        </div>

        <Typography component="span" variant="small1" color="text.primary">
          {formatCentsToReadableValue(borrowLimitCents)}
        </Typography>
      </div>

      <ProgressBarHorizontal
        css={styles.progressBar}
        value={safeLimitPercentage}
        mark={80}
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
          {safeLimitPercentage}%
        </Typography>

        <Tooltip css={styles.tooltip} title="tooltip content">
          <Icon css={styles.getInfoIcon({ position: 'right' })} name="info" />
        </Tooltip>
      </Typography>
    </div>
  );
};

const MyAccount: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const userMarketInfo = useUserMarketInfo({ account: account?.address });

  const uiProps = React.useMemo(() => {
    const netApyPercentage = undefined;
    const dailyEarningsCents = undefined;
    const supplyBalanceCents = undefined;
    const borrowBalanceCents = undefined;
    const borrowLimitCents = undefined;
    const safeLimitPercentage = undefined;

    return {
      netApyPercentage,
      dailyEarningsCents,
      supplyBalanceCents,
      borrowBalanceCents,
      borrowLimitCents,
      safeLimitPercentage,
    };
  }, [userMarketInfo]);

  return <MyAccountUi {...uiProps} />;
};

export default MyAccount;

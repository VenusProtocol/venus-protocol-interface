/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Slider } from '../Slider';
import { useMyAccountStyles as useStyles } from './styles';
import { IToggleProps, Toggle } from '../Toggle';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

function toPercentageString(n: number) {
  return `${n}%`;
}
function toUsdString(n: number) {
  return `$${n}`;
}

interface IMyAccountProps {
  netApyPercentage: number;
  dailyEarningsCents: number;
  supplyBalanceCents: number;
  borrowBalanceCents: number;
  borrowLimitCents: number;
  safeLimitPercentage: number;
  borrowLimitUsedPercentage: number;
}

export const MyAccount = ({
  netApyPercentage,
  dailyEarningsCents,
  supplyBalanceCents,
  borrowBalanceCents,
  borrowLimitCents,
  safeLimitPercentage,
}: IMyAccountProps) => {
  const [isToggleSwitched, setToggleSwitched] = useState(true);
  const handleSwitch: IToggleProps['onChange'] = (event, checked) => {
    setToggleSwitched(checked);
  };
  const styles = useStyles();
  return (
    <Box css={styles.root} component={Paper}>
      <div css={styles.row}>
        <Typography variant="h4">My account</Typography>
        <Typography component="span" variant="small2" css={styles.apyWithXvs}>
          <Tooltip css={styles.tooltip} title="tooltip content">
            <Icon css={styles.iconInfo} name="info" />
          </Tooltip>
          <Typography color="text.primary" variant="small1">
            APY with XVS
          </Typography>
          <Toggle parentStyles={styles.toggle} value={isToggleSwitched} onChange={handleSwitch} />
        </Typography>
      </div>
      <div>
        <Typography component="p" variant="small2" css={styles.netApyLabel}>
          Net APY
          <Tooltip css={styles.tooltip} title="tooltip content">
            <Icon css={styles.iconInfo} name="info" />
          </Tooltip>
        </Typography>
        <Typography variant="h1" color="interactive.success">
          {toPercentageString(netApyPercentage)}
        </Typography>
      </div>
      <ul css={styles.list}>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="p" variant="small2" css={styles.labelListItem}>
            Daily earnings
          </Typography>
          {toUsdString(dailyEarningsCents)}
        </Typography>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="p" variant="small2" css={styles.labelListItem}>
            Supply balance
          </Typography>
          {toUsdString(supplyBalanceCents)}
        </Typography>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="p" variant="small2" css={styles.labelListItem}>
            Borrow balance
          </Typography>
          {toUsdString(borrowBalanceCents)}
        </Typography>
      </ul>
      <div css={styles.row}>
        <Typography component="div" variant="small2" css={styles.borrowLimitLabelWrapper}>
          <Typography component="p" variant="small2" css={styles.borrowLimitLabel}>
            Borrow limit:
          </Typography>
          <Typography
            component="span"
            variant="small1"
            color="text.primary"
            css={styles.borrowLimitLabel}
          >
            {toPercentageString(safeLimitPercentage)}
          </Typography>
        </Typography>
        {toUsdString(borrowLimitCents)}
      </div>
      <Slider
        defaultValue={safeLimitPercentage}
        mark={80}
        step={1}
        ariaLabel="Borrow limit"
        min={0}
        max={100}
        onChange={console.log}
        isDisabled
      />
      <Typography component="div" variant="small2" css={styles.bottom}>
        <Icon name="shield" />
        <Typography component="p" css={styles.safeLimit}>
          Your safe limit:
        </Typography>
        {toPercentageString(safeLimitPercentage)}
        <Tooltip css={styles.tooltip} title="tooltip content">
          <Icon css={styles.iconInfo} name="info" />
        </Tooltip>
      </Typography>
    </Box>
  );
};

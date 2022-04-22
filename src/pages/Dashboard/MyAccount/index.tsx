/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { formatCentsToReadableValue } from 'utilities/common';
import { Slider } from '../../../components/v2/Slider';
import { useMyAccountStyles as useStyles } from './styles';
import { IToggleProps, Toggle } from '../../../components/v2/Toggle';
import { Icon } from '../../../components/v2/Icon';
import { Tooltip } from '../../../components/v2/Tooltip';

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
          <Toggle css={styles.toggle} value={isToggleSwitched} onChange={handleSwitch} />
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
          {netApyPercentage}%
        </Typography>
      </div>
      <ul css={styles.list}>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="p" variant="small2" css={styles.labelListItem}>
            Daily earnings
          </Typography>
          {formatCentsToReadableValue(dailyEarningsCents)}
        </Typography>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="p" variant="small2" css={styles.labelListItem}>
            Supply balance
          </Typography>
          {formatCentsToReadableValue(supplyBalanceCents)}
        </Typography>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="p" variant="small2" css={styles.labelListItem}>
            Borrow balance
          </Typography>
          {formatCentsToReadableValue(borrowBalanceCents)}
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
            {safeLimitPercentage}%
          </Typography>
        </Typography>
        {formatCentsToReadableValue(borrowLimitCents)}
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
        {safeLimitPercentage}%
        <Tooltip css={styles.tooltip} title="tooltip content">
          <Icon css={styles.iconInfo} name="info" />
        </Tooltip>
      </Typography>
    </Box>
  );
};

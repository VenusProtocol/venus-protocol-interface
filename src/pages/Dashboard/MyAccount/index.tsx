/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { formatCentsToReadableValue } from 'utilities/common';
import { IToggleProps, Toggle, Icon, ProgressBarHorizontal, Tooltip } from 'components';
import { useTranslation } from 'translation';
import { useMyAccountStyles as useStyles } from './styles';

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
  const { t } = useTranslation();
  return (
    <Box css={styles.root} component={Paper}>
      <div css={styles.row}>
        <Typography variant="h4">My account</Typography>
        <Typography component="span" variant="small2" css={styles.apyWithXvs}>
          <Tooltip css={styles.tooltip} title={t('myAccount.apyWithXvsTooltip')}>
            <Icon css={styles.iconInfo} name="info" />
          </Tooltip>
          <Typography color="text.primary" variant="small1">
            {t('myAccount.apyWithXvs')}
          </Typography>
          <Toggle css={styles.toggle} value={isToggleSwitched} onChange={handleSwitch} />
        </Typography>
      </div>
      <div>
        <Typography component="p" variant="small2" css={styles.netApyLabel}>
          {t('myAccount.netApy')}
          <Tooltip css={styles.tooltip} title={t('myAccount.netApyTooltip')}>
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
            {t('myAccount.dailyEarnings')}
          </Typography>
          {formatCentsToReadableValue(dailyEarningsCents)}
        </Typography>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="p" variant="small2" css={styles.labelListItem}>
            {t('myAccount.supplyBalance')}
          </Typography>
          {formatCentsToReadableValue(supplyBalanceCents)}
        </Typography>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="p" variant="small2" css={styles.labelListItem}>
            {t('myAccount.borrowBalance')}
          </Typography>
          {formatCentsToReadableValue(borrowBalanceCents)}
        </Typography>
      </ul>
      <div css={styles.row}>
        <Typography component="div" variant="small2" css={styles.borrowLimitLabelWrapper}>
          <Typography component="p" variant="small2" css={styles.borrowLimitLabel}>
            {t('myAccount.borrowLimit')}
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
      <ProgressBarHorizontal
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
        <Icon name="shield" />
        <Typography component="p" css={styles.safeLimit}>
          {t('myAccount.safeLimit')}
        </Typography>
        {safeLimitPercentage}%
        <Tooltip css={styles.tooltip} title={t('myAccount.safeLimitTooltip')}>
          <Icon css={styles.iconInfo} name="info" />
        </Tooltip>
      </Typography>
    </Box>
  );
};

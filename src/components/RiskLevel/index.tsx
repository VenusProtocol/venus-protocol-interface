/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'translation';
import { PoolRiskLevel } from 'types';

import { Tooltip } from '../Tooltip';
import { useStyles } from './styles';

interface RiskLevelProps {
  className?: string;
  variant: PoolRiskLevel;
}

export const RiskLevel = ({ variant, ...containerProps }: RiskLevelProps) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const getText = () => {
    if (variant === 'MINIMAL') {
      return t('riskLevel.minimal');
    }

    if (variant === 'LOW') {
      return t('riskLevel.low');
    }

    if (variant === 'MEDIUM') {
      return t('riskLevel.medium');
    }

    if (variant === 'HIGH') {
      return t('riskLevel.high');
    }

    return t('riskLevel.veryHigh');
  };

  return (
    <Tooltip title={t('riskLevel.tooltip')} css={styles.container} {...containerProps}>
      <div css={styles.content}>
        <div css={styles.getDot({ variant })} />

        <Typography css={styles.getText({ variant })} component="span" variant="small2">
          {getText()}
        </Typography>
      </div>
    </Tooltip>
  );
};

export const RiskLevelMinimal: React.FC<Omit<RiskLevelProps, 'variant'>> = props => (
  <RiskLevel variant="MINIMAL" {...props} />
);

export const RiskLevelLow: React.FC<Omit<RiskLevelProps, 'variant'>> = props => (
  <RiskLevel variant="LOW" {...props} />
);

export const RiskLevelMedium: React.FC<Omit<RiskLevelProps, 'variant'>> = props => (
  <RiskLevel variant="MEDIUM" {...props} />
);

export const RiskLevelHigh: React.FC<Omit<RiskLevelProps, 'variant'>> = props => (
  <RiskLevel variant="HIGH" {...props} />
);

export const RiskLevelVeryHigh: React.FC<Omit<RiskLevelProps, 'variant'>> = props => (
  <RiskLevel variant="VERY_HIGH" {...props} />
);

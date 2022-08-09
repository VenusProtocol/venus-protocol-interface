/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'translation';

import { Tooltip } from '../Tooltip';
import { useStyles } from './styles';
import { RiskLevelVariant } from './types';

interface RiskLevelProps {
  className?: string;
  variant: RiskLevelVariant;
}

export const RiskLevel = ({ variant, ...containerProps }: RiskLevelProps) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const getText = () => {
    if (variant === 'low') {
      return t('riskLevel.low');
    }

    if (variant === 'medium') {
      return t('riskLevel.medium');
    }

    return t('riskLevel.high');
  };

  return (
    <Tooltip title={t('riskLevel.tooltip')} {...containerProps}>
      <div css={styles.content}>
        <div css={styles.getDot({ variant })} />

        <Typography css={styles.getText({ variant })} component="span">
          {getText()}
        </Typography>
      </div>
    </Tooltip>
  );
};

export const RiskLevelLow: React.FC<Omit<RiskLevelProps, 'variant'>> = props => (
  <RiskLevel variant="low" {...props} />
);
export const RiskLevelMedium: React.FC<Omit<RiskLevelProps, 'variant'>> = props => (
  <RiskLevel variant="medium" {...props} />
);
export const RiskLevelHigh: React.FC<Omit<RiskLevelProps, 'variant'>> = props => (
  <RiskLevel variant="high" {...props} />
);

/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { Icon, IconName } from '../Icon';
import { useStyles } from './styles';

export interface ILabeledInlineValueProps {
  label: string;
  value: string | number;
  iconName?: IconName;
  className?: string;
}

export const LabeledInlineValue = ({
  label,
  value,
  iconName,
  className,
}: ILabeledInlineValueProps) => {
  const styles = useStyles();

  return (
    <div css={styles.container} className={className}>
      <div css={styles.column}>
        {iconName && <Icon name={iconName} css={styles.icon} />}

        <Typography component="span" variant="small2">
          {label}
        </Typography>
      </div>

      <Typography component="div" css={[styles.column, styles.value]} variant="small1">
        {value}
      </Typography>
    </div>
  );
};

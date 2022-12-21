/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React from 'react';

import { useStyles } from './styles';
import { ChipProps } from './types';

export * from './types';

export const Chip = ({ className, text, icon, type = 'default' }: ChipProps) => {
  const styles = useStyles();

  return (
    <div className={className} css={styles.root({ chipType: type })}>
      {icon}

      <Typography variant="small2" color="textPrimary">
        {text}
      </Typography>
    </div>
  );
};

export const ActiveChip: React.FC<ChipProps> = ({ type: _type, ...props }) => (
  <Chip type="active" {...props} />
);

export const InactiveChip: React.FC<ChipProps> = ({ type: _type, ...props }) => (
  <Chip type="inactive" {...props} />
);

export const BlueChip: React.FC<ChipProps> = ({ type: _type, ...props }) => (
  <Chip type="blue" {...props} />
);

export const ErrorChip: React.FC<ChipProps> = ({ type: _type, ...props }) => (
  <Chip type="error" {...props} />
);

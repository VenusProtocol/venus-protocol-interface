/** @jsxImportSource @emotion/react */
import React from 'react';
import Switch from '@mui/material/Switch';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';

import { useStyles } from './styles';

export interface IToggleProps {
  onChange: SwitchBaseProps['onChange'];
  value: boolean;
  className?: string;
}

const label = { inputProps: { 'aria-label': 'Switch' } };

export const Toggle = ({ onChange, value, className }: IToggleProps) => {
  const styles = useStyles();
  return (
    <Switch
      className={className}
      css={styles}
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      onChange={onChange}
      checked={value}
      {...label}
    />
  );
};

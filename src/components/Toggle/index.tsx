/** @jsxImportSource @emotion/react */
import Switch from '@mui/material/Switch';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';
import React from 'react';

import { useStyles } from './styles';

export interface ToggleProps {
  onChange: SwitchBaseProps['onChange'];
  value: boolean;
  className?: string;
}
export const switchAriaLabel = 'Switch';
const label = { inputProps: { 'aria-label': switchAriaLabel } };

export const Toggle = ({ onChange, value, className }: ToggleProps) => {
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

/** @jsxImportSource @emotion/react */
import React from 'react';
import Switch from '@mui/material/Switch';
import { SerializedStyles } from '@emotion/react';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';
import { useStyles } from './styles';

export interface IToggleProps {
  onChange: SwitchBaseProps['onChange'];
  value: boolean;
  parentStyles?: SerializedStyles;
}

const label = { inputProps: { 'aria-label': 'Switch' } };

export const Toggle = ({ onChange, value, parentStyles }: IToggleProps) => {
  const styles = useStyles();
  return (
    <Switch
      css={[styles, parentStyles]}
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      onChange={onChange}
      checked={value}
      {...label}
    />
  );
};

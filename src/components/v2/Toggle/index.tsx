import React from 'react';
import Switch from '@mui/material/Switch';
import { useStyles } from './styles';

export interface IToggleProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  value: boolean;
}

const label = { inputProps: { 'aria-label': 'Switch' } };

export const Toggle = ({ onChange, value }: IToggleProps) => {
  const styles = useStyles();
  return (
    <Switch
      sx={styles}
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      onChange={onChange}
      checked={value}
      {...label}
    />
  );
};

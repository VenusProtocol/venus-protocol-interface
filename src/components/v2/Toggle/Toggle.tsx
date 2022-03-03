import React from 'react';
import Switch from '@mui/material/Switch';
import { useStyles } from './ToggleStyles';

interface IToggleProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

const label = { inputProps: { 'aria-label': 'Switch' } };

export const Toggle = ({ onChange }: IToggleProps) => {
  const styles = useStyles();
  return (
    <Switch
      sx={styles}
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      onChange={onChange}
      {...label}
    />
  );
};

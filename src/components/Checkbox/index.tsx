/** @jsxImportSource @emotion/react */
import React from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface ICheckboxProps {
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Checkbox = ({ value, onChange, className }: ICheckboxProps) => {
  const styles = useStyles();
  return (
    <MuiCheckbox
      className={className}
      css={styles.root}
      checked={value}
      onChange={onChange}
      icon={<Icon name="checkboxBorder" />}
      checkedIcon={<Icon name="checked" />}
      disableRipple
    />
  );
};

export default Checkbox;

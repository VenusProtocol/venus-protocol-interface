/** @jsxImportSource @emotion/react */
import MuiCheckbox from '@mui/material/Checkbox';
import * as React from 'react';

import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface CheckboxProps {
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Checkbox = ({ value, ...otherProps }: CheckboxProps) => {
  const styles = useStyles();
  return (
    <MuiCheckbox
      css={styles.root}
      checked={value}
      icon={<Icon name="checkboxBorder" />}
      checkedIcon={<Icon name="checked" />}
      disableRipple
      {...otherProps}
    />
  );
};

export default Checkbox;

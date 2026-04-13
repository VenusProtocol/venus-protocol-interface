/** @jsxImportSource @emotion/react */
import MuiCheckbox from '@mui/material/Checkbox';

import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface CheckboxProps {
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox = ({ value, size = 'lg', ...otherProps }: CheckboxProps) => {
  const styles = useStyles({ size });
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

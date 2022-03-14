/** @jsxImportSource @emotion/react */
import React from 'react';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import { Icon } from 'components/v2/Icon';
import useStyles from './styles';

export interface IButtonProps extends ButtonProps {
  className?: string;
  loading?: boolean;
}

export const Button = ({
  className,
  loading,
  disabled,
  startIcon = null,
  ...restProps
}: IButtonProps) => {
  const styles = useStyles();
  return (
    <MuiButton
      css={styles}
      className={className}
      startIcon={loading ? <Icon name="loading" size="28px" /> : startIcon}
      disabled={loading || disabled}
      disableRipple
      {...restProps}
    />
  );
};

export const PrimaryButton = (props: IButtonProps) => (
  <Button variant="contained" color="button" {...props} />
);

export const SecondaryButton = (props: IButtonProps) => (
  <Button variant="outlined" color="button" {...props} />
);

export const TextButton = (props: IButtonProps) => <Button variant="text" {...props} />;

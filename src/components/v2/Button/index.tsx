import React from 'react';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import { Icon } from 'components/v2/Icon';

export interface IButtonProps extends ButtonProps {
  className?: string;
  loading?: boolean;
  loadingIconSize?: string;
  loadingIconColor?: string;
}

export const Button = ({
  className,
  children,
  loading,
  loadingIconSize,
  loadingIconColor,
  ...restProps
}: IButtonProps) => (
  <MuiButton className={className} {...restProps}>
    {loading && <Icon size={loadingIconSize} color={loadingIconColor} name="loading" />}
    {children}
  </MuiButton>
);

import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';
import { Icon } from 'components';
// import SwapHorizIcon from '@mui/icons-material/loading';
interface IButtonProps extends ButtonProps {
  className?: string;
  loading?: boolean;
  loadingIconSize?: number;
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

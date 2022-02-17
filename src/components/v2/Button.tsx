import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface IButtonProps extends ButtonProps {
  className?: string;
}

export const Button = ({ className, children, ...restProps }: IButtonProps) => (
  <MuiButton className={className} {...restProps}>
    {children}
  </MuiButton>
);

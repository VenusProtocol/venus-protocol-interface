import React from 'react';
import { Button as MUIButton, ButtonProps } from '@material-ui/core';


interface IButtonProps extends ButtonProps {
  className?: string;
}

export const Button = ({ className, children, ...restProps }: IButtonProps) => (
  <MUIButton className={className} {...restProps}>
    {children}
  </MUIButton>
  );

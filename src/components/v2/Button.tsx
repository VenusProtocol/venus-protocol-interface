import React from 'react';
import { Button as AntdButton } from 'antd';
import { ButtonProps } from 'antd/lib/button';

interface IButtonProps extends ButtonProps {
  className?: string;
}

export const Button = ({ className, children, ...restProps }: IButtonProps) => (
  <AntdButton className={className} {...restProps}>
    {children}
  </AntdButton>
  );

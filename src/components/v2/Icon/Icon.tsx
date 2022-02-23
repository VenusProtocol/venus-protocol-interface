import { useTheme } from '@mui/material';
import React from 'react';
import * as icons from './icons';

export type IconName = keyof typeof icons;

export interface IIconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

export const Icon: React.FC<IIconProps> = ({ name, size, color, ...otherProps }) => {
  const theme = useTheme();
  const sanitizedSize = size ?? theme.spacing(2);
  const sanitizedColor = color ?? theme.palette.text.secondary;

  const Component = icons[name];

  return (
    <Component
      width={sanitizedSize}
      height={sanitizedSize}
      color={sanitizedColor}
      {...otherProps}
    />
  );
};

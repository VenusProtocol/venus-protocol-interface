import React, { useRef } from 'react';
import { useTheme } from '@mui/material';
import { uniqueId } from 'lodash';
import * as icons from './icons';

export type IconName = keyof typeof icons;

export interface IIconProps {
  name: IconName;
  size?: string;
  color?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Icon: React.FC<IIconProps> = ({ name, size, color, ...otherProps }) => {
  const idRef = useRef<string>(uniqueId());

  const theme = useTheme();
  const sanitizedSize = size ?? theme.shape.iconSize.medium;
  const sanitizedColor = color ?? theme.palette.text.secondary;
  // Because "name" could come from fetched data, we use a default icon in case
  // the one requested isn't found
  const Component = icons[name] || icons.mask;

  return (
    <Component
      width={sanitizedSize}
      height={sanitizedSize}
      color={sanitizedColor}
      id={idRef.current}
      {...otherProps}
    />
  );
};

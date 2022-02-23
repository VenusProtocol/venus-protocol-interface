import React from 'react';
import * as icons from './icons';

export type IconName = keyof typeof icons;

export interface IIconProps {
  name: IconName;
  size?: number;
  // TODO: add color
  className?: string;
}

export const Icon: React.FC<IIconProps> = ({
  name,
  size = 16, // TODO: get from theme
  ...otherProps
}) => {
  const Component = icons[name];

  return <Component width={size} height={size} {...otherProps} />;
};

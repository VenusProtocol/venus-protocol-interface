import { cn } from '@venusprotocol/ui';
import _uniqueId from 'lodash/uniqueId';
import { useRef } from 'react';

import * as icons from './icons';

export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Icon: React.FC<IconProps> = ({ name, className, ...otherProps }) => {
  const idRef = useRef<string>(_uniqueId());

  // Because "name" could come from fetched data, we use a default icon in case
  // the one requested isn't found
  const Component = icons[name] || icons.mask;

  return (
    <Component
      className={cn('size-4 text-light-grey', className)}
      id={idRef.current}
      {...otherProps}
    />
  );
};

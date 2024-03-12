/** @jsxImportSource @emotion/react */
import { cn } from 'utilities';

import { Icon, type IconName } from '../Icon';
import { Tooltip } from '../Tooltip';

export interface InfoIconProps {
  tooltip: string;
  iconName?: IconName;
  iconClassName?: string;
  className?: string;
}

export const InfoIcon = ({
  tooltip,
  className,
  iconName = 'info',
  iconClassName,
}: InfoIconProps) => (
  <Tooltip className={cn('inline-flex', className)} title={tooltip}>
    <Icon className={cn('cursor-help', iconClassName)} name={iconName} />
  </Tooltip>
);

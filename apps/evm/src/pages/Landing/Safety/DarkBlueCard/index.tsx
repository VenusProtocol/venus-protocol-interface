import { cn } from '@venusprotocol/ui';

import { Card, type CardProps } from 'components';

export interface DarkBlueCardProps extends CardProps {}

export const DarkBlueCard: React.FC<DarkBlueCardProps> = ({ className, ...otherProps }) => (
  <Card className={cn('bg-dark-blue-active p-4', className)} {...otherProps} />
);

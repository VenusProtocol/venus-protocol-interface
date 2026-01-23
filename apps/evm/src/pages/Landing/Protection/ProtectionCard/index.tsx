import { cn } from '@venusprotocol/ui';

import { Card, type CardProps } from 'components';

export interface ProtectionCardProps extends CardProps {}

export const ProtectionCard: React.FC<ProtectionCardProps> = ({ className, ...otherProps }) => (
  <Card
    className={cn(
      'relative flex md:flex-1 overflow-hidden flex-col h-87.5 justify-between p-6 lg:px-10 pb-0 md:h-112.5 lg:h-139 xl:p-10 xl:pb-0',
      className,
    )}
    {...otherProps}
  />
);

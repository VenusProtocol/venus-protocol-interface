import { cn } from '@venusprotocol/ui';

import { Card } from 'components';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassCard: React.FC<GlassCardProps> = ({ className, ...otherProps }) => (
  <Card
    className={cn(
      'p-3 border-transparent bg-[rgba(24,29,42,0.1)] shadow-[0_-1px_1px_0_#21293A_inset,0_1px_1px_0_rgba(255,255,255,0.25)_inset] backdrop-blur-xs',
      className,
    )}
    {...otherProps}
  />
);

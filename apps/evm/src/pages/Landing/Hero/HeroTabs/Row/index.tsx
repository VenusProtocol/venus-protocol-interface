import { cn } from '@venusprotocol/ui';

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Row: React.FC<RowProps> = ({ className, ...otherProps }) => (
  <div className={cn('flex justify-between items-center gap-6', className)} {...otherProps} />
);

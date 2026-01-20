import { Slot } from '@radix-ui/react-slot';
import { cn } from '@venusprotocol/ui';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, asChild = false, ...otherProps }) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn('block w-full rounded-lg p-4 border border-dark-blue-hover', className)}
      {...otherProps}
    />
  );
};

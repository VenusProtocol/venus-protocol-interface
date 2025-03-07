import { Slot } from '@radix-ui/react-slot';
import { cn } from '@venusprotocol/ui';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, asChild = false, ...otherProps }) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn('bg-cards block w-full rounded-xl p-4 sm:p-6', className)}
      {...otherProps}
    />
  );
};

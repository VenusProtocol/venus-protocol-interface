import { Slot } from '@radix-ui/react-slot';
import { cn } from '@venusprotocol/ui';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  variant?: 'primary' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  className,
  asChild = false,
  variant = 'primary',
  ...otherProps
}) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn(
        'block w-full rounded-lg p-4 border',
        variant === 'primary' && 'border-card bg-card',
        variant === 'glass' &&
          'relative isolate border-glass bg-surface-glass shadow-glass before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-glass',
        className,
      )}
      {...otherProps}
    />
  );
};

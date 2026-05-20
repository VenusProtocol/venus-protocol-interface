import { Slot } from '@radix-ui/react-slot';
import { cn } from '@venusprotocol/ui';

export interface TickMarkProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  asChild?: boolean;
  className?: string;
}

export const TickMark: React.FC<TickMarkProps> = ({
  isActive = false,
  className,
  asChild,
  ...otherProps
}) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn(
        'size-3 shrink-0 outline-hidden rounded-full border border-light-grey-disabled absolute',
        isActive ? 'bg-light-grey-active' : 'bg-dark-blue-hover',
        className,
      )}
      {...otherProps}
    />
  );
};

import { cn } from '@venusprotocol/ui';
import { forwardRef } from 'react';

export const CarouselItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0 basis-full', 'pl-4', className)}
      {...props}
    />
  ),
);

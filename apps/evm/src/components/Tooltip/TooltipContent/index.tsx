import { Content, Portal } from '@radix-ui/react-tooltip';
import { cn } from '@venusprotocol/ui';
import React from 'react';

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Portal>
    <Content
      ref={ref}
      onClick={e => e.stopPropagation()}
      sideOffset={sideOffset}
      className={cn(
        'flex z-50 overflow-hidden rounded-lg border border-raised bg-tooltip p-2 max-w-75 text-sm text-primary-foreground shadow-menu backdrop-blur-raised backdrop-saturate-[1.2] animate-tooltip-in',
        'data-[side=bottom]:[--tooltip-rise:-4px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        'has-[table]:overflow-visible [&:has(table)_.overflow-auto]:max-h-80',
        className,
      )}
      {...props}
    />
  </Portal>
));
TooltipContent.displayName = Content.displayName;

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
        'flex z-50 overflow-hidden rounded-xl bg-lightGrey p-2 max-w-75 text-sm text-primary-foreground animate-in fade-in-0 zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </Portal>
));
TooltipContent.displayName = Content.displayName;

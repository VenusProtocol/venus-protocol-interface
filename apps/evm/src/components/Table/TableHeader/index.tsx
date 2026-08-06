import { cn } from '@venusprotocol/ui';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export const TableHeader = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'thead'>>(
  ({ className, ...otherProps }, ref) => (
    <thead ref={ref} className={cn(className)} {...otherProps} />
  ),
);

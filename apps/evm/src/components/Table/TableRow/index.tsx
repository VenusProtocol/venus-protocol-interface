import { cn } from '@venusprotocol/ui';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export const TableRow = forwardRef<HTMLTableRowElement, ComponentPropsWithoutRef<'tr'>>(
  ({ className, ...otherProps }, ref) => (
    <tr ref={ref} className={cn('border-0 transition-colors', className)} {...otherProps} />
  ),
);

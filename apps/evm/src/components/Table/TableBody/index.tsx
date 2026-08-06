import { cn } from '@venusprotocol/ui';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export const TableBody = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'tbody'>>(
  ({ className, ...otherProps }, ref) => (
    <tbody ref={ref} className={cn(className)} {...otherProps} />
  ),
);

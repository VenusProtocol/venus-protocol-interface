import { cn } from '@venusprotocol/ui';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export const TableElement = forwardRef<HTMLTableElement, ComponentPropsWithoutRef<'table'>>(
  ({ className, ...otherProps }, ref) => (
    <table
      ref={ref}
      className={cn('w-full caption-bottom border-collapse text-b1r', className)}
      {...otherProps}
    />
  ),
);

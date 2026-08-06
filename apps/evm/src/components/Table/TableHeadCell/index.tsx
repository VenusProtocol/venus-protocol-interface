import { cn } from '@venusprotocol/ui';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export const TableHeadCell = forwardRef<HTMLTableCellElement, ComponentPropsWithoutRef<'th'>>(
  ({ align, className, ...otherProps }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-14 border-0 p-4 align-middle text-b1r leading-6 text-grey normal-case',
        (!align || align === 'left') && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className,
      )}
      {...otherProps}
    />
  ),
);

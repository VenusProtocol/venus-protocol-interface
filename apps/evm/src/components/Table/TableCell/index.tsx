import { cn } from '@venusprotocol/ui';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export const TableCell = forwardRef<HTMLTableCellElement, ComponentPropsWithoutRef<'td'>>(
  ({ align, className, ...otherProps }, ref) => (
    <td
      ref={ref}
      className={cn(
        'border-0 px-4 py-0 align-middle text-b1r normal-case',
        (!align || align === 'left') && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className,
      )}
      {...otherProps}
    />
  ),
);

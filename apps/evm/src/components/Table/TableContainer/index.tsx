import { cn } from '@venusprotocol/ui';
import type { ComponentPropsWithoutRef } from 'react';

export function TableContainer({ className, ...otherProps }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('relative w-full overflow-auto', className)} {...otherProps} />;
}

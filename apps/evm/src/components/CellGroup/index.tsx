import { cn } from '@venusprotocol/ui';

import { Card } from 'components';
import { Cell, type CellProps } from '../Cell';

export type { CellProps } from '../Cell';

export type CellGroupVariant = 'primary' | 'secondary';

export interface CellGroupProps {
  cells: CellProps[];
  variant?: CellGroupVariant;
  className?: string;
}

export const CellGroup: React.FC<CellGroupProps> = ({
  cells,
  variant = 'primary',
  className,
  ...containerProps
}) => (
  <Card
    className={cn(
      'min-w-0 border-0 p-0 gap-4 md:gap-x-6',
      variant === 'primary' &&
        'flex overflow-x-auto overflow-y-hidden scrollbar-hidden bg-transparent',
      variant === 'secondary' && 'grid grid-cols-2 xl:flex xl:flex-wrap xl:rounded-xl',
      className,
    )}
    {...containerProps}
  >
    {cells.map(cell => (
      <Cell
        key={`cell-group-item-${cell.label}`}
        {...cell}
        className={cn('shrink-0 xl:bg-transparent', cell.className)}
      />
    ))}
  </Card>
);

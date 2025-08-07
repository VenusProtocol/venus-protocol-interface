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
      variant === 'secondary'
        ? 'p-0 flex overflow-y-auto scrollbar-hidden bg-transparent sm:p-0 md:p-0 xl:p-0'
        : 'p-4 grid grid-cols-2 rounded-xl gap-4 sm:flex sm:flex-wrap sm:gap-0 sm:px-6 sm:py-4',
      className,
    )}
    {...containerProps}
  >
    {cells.map(cell => (
      <Cell
        key={`cell-group-item-${cell.label}`}
        {...cell}
        className={cn(
          'xl:bg-transparent',
          variant === 'secondary'
            ? 'px-4 md:px-6 first-of-type:pl-0 last-of-type:pr-0 border-r border-r-offWhite/10 last-of-type:border-r-0'
            : 'sm:px-6 sm:first-of-type:pl-0 sm:last-of-type:pr-0 sm:border-r sm:last-of-type:border-r-0 sm:border-lightGrey',
          cell.className,
        )}
      />
    ))}
  </Card>
);

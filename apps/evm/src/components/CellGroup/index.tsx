import { cn } from '@venusprotocol/ui';

import { Card } from 'components';
import { Cell, type CellProps } from '../Cell';

export type { CellProps } from '../Cell';

export type CellGroupVariant = 'primary' | 'secondary' | 'tertiary';

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
      'border-0',
      variant === 'primary' &&
        'p-4 grid grid-cols-2 rounded-xl gap-4 sm:flex sm:flex-wrap sm:gap-0 sm:px-6 sm:py-4',
      variant === 'secondary' &&
        'p-0 flex overflow-x-auto overflow-y-hidden scrollbar-hidden bg-transparent sm:p-0 md:p-0 xl:p-0',
      variant === 'tertiary' &&
        'gap-2 bg-transparent p-0 grid grid-cols-2 sm:p-0 xl:bg-cards xl:flex xl:p-6 xl:flex-wrap xl:rounded-xl xl:gap-x-0',
      className,
    )}
    {...containerProps}
  >
    {cells.map(cell => (
      <Cell
        key={`cell-group-item-${cell.label}`}
        {...cell}
        className={cn(
          'shrink-0 xl:bg-transparent',
          variant === 'primary' &&
            'sm:px-6 sm:first-of-type:pl-0 sm:last-of-type:pr-0 sm:border-r sm:last-of-type:border-r-0 sm:border-lightGrey',
          variant === 'secondary' &&
            'px-4 md:px-6 first-of-type:pl-0 last-of-type:pr-0 border-r border-r-white/10 last-of-type:border-r-0',
          variant === 'tertiary' &&
            'bg-cards rounded-xl p-4 xl:py-0 xl:px-6 xl:rounded-none xl:first-of-type:pl-0 xl:last-of-type:pr-0 xl:border-r xl:last-of-type:border-r-0 xl:border-lightGrey',
          cell.className,
        )}
      />
    ))}
  </Card>
);

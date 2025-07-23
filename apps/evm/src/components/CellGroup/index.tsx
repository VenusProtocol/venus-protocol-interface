import { cn } from '@venusprotocol/ui';

import { Cell, type CellProps } from '../Cell';

export type { CellProps } from '../Cell';

export type CellGroupVariant = 'primary' | 'secondary';

export interface CellGroupProps {
  cells: CellProps[];
  variant?: CellGroupVariant;
  small?: boolean;
  className?: string;
}

export const CellGroup: React.FC<CellGroupProps> = ({
  cells,
  variant = 'primary',
  small = false,
  className,
  ...containerProps
}) => (
  <div
    className={cn(
      'gap-2 bg-transparent p-0',
      variant === 'secondary'
        ? 'flex overflow-y-auto scrollbar-hidden'
        : 'grid grid-cols-1 sm:grid-cols-2 xl:bg-cards xl:flex xl:p-6 xl:flex-wrap xl:rounded-xl xl:gap-x-0',
      className,
    )}
    {...containerProps}
  >
    {cells.map(cell => (
      <Cell
        key={`cell-group-item-${cell.label}`}
        small={small}
        {...cell}
        className={cn(
          'xl:bg-transparent',
          variant === 'secondary'
            ? 'px-4 md:px-6 first-of-type:pl-0 last-of-type:pr-0 border-r border-r-offWhite/10 last-of-type:border-r-0'
            : 'bg-cards rounded-xl p-4 xl:py-0 xl:px-6 xl:rounded-none xl:first-of-type:pl-0 xl:last-of-type:pr-0 xl:border-r xl:last-of-type:border-r-0 xl:border-lightGrey',
          cell.className,
        )}
      />
    ))}
  </div>
);

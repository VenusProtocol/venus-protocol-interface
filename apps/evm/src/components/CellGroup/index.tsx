import { cn } from '@venusprotocol/ui';
import { Fragment } from 'react/jsx-runtime';

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
        'p-0 flex overflow-y-auto scrollbar-hidden bg-transparent sm:p-0 md:p-0 xl:p-0',
      variant === 'tertiary' &&
        'gap-2 bg-transparent p-0 grid grid-cols-2 sm:p-0 xl:bg-cards xl:flex xl:p-6 xl:flex-wrap xl:rounded-xl xl:gap-x-0',
      className,
    )}
    {...containerProps}
  >
    {cells.map((cell, index) => (
      <Fragment key={`cell-group-item-${cell.label}`}>
        <Cell
          {...cell}
          className={cn(
            'xl:bg-transparent',
            variant === 'primary' && 'sm:px-6 sm:first-of-type:pl-0 sm:last-of-type:pr-0',
            variant === 'secondary' && 'px-5 first-of-type:pl-0 last-of-type:pr-0',
            variant === 'tertiary' &&
              'bg-cards rounded-xl p-4 xl:py-0 xl:px-6 xl:rounded-none xl:first-of-type:pl-0 xl:last-of-type:pr-0',
            cell.className,
          )}
        />

        {index < cells.length - 1 && (
          <div
            className={cn(
              'w-px self-stretch shrink-0 bg-dark-grey',
              variant === 'primary' && 'hidden sm:block',
              variant === 'secondary' && 'bg-white/10',
              variant === 'tertiary' && 'hidden xl:block',
            )}
          />
        )}
      </Fragment>
    ))}
  </Card>
);

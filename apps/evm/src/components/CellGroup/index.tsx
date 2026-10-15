import { cn } from '@venusprotocol/ui';
import { Fragment } from 'react';

import { Card, Delimiter } from 'components';
import { useTranslation } from 'libs/translations';
import { Cell, type CellProps, type CellVariant } from '../Cell';

export type { CellProps } from '../Cell';

export interface CellGroupProps {
  cells: CellProps[];
  grid?: boolean;
  variant?: CellVariant;
  className?: string;
  ariaLabel?: string;
  focusable?: boolean;
}

export const CellGroup: React.FC<CellGroupProps> = ({
  cells,
  variant = 'primary',
  grid = false,
  className,
  ariaLabel,
  focusable = true,
  ...containerProps
}) => {
  const { t } = useTranslation();

  return (
    <Card
      className={cn(
        'min-w-0 border-0 p-0 gap-4 md:gap-x-6',
        grid
          ? 'grid grid-cols-2 xl:flex xl:flex-wrap xl:rounded-xl'
          : 'flex overflow-x-auto overflow-y-hidden scrollbar-hidden bg-transparent',
        className,
      )}
      {...(grid || !focusable
        ? undefined
        : {
            role: 'group',
            tabIndex: 0,
            'aria-label': ariaLabel ?? t('cellGroup.ariaLabel'),
          })}
      {...containerProps}
    >
      {cells.map((cell, index) => (
        <Fragment key={`cell-group-item-${cell.label}`}>
          <Cell
            variant={variant}
            {...cell}
            className={cn('shrink-0 xl:bg-transparent', cell.className)}
          />

          {variant === 'secondary' && index < cells.length - 1 && <Delimiter vertical />}
        </Fragment>
      ))}
    </Card>
  );
};

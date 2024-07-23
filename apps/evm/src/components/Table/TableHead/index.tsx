import type { Column } from '@tanstack/react-table';

import { Icon } from 'components';
import { cn } from 'utilities';
import { TableCell } from '../TableCell';

export interface TableHeadCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  column: Column<any>;
  align?: 'left' | 'right';
}

export const TableHead: React.FC<TableHeadCellProps> = ({
  className,
  children,
  column,
  ...otherProps
}) => (
  <TableCell
    asChild
    className={cn(
      'font-normal text-grey text-sm whitespace-nowrap',
      column.getCanSort() && 'cursor-pointer',
      column.columnDef.meta?.className,
      className,
    )}
    onClick={
      column.getCanSort()
        ? () => column.toggleSorting(!column.getIsSorted() ? true : column.getIsSorted() === 'asc')
        : undefined
    }
    {...otherProps}
  >
    <th>
      <div className="items-center inline-flex gap-x-2">
        <span>{children}</span>

        {column.getCanSort() && (
          <div className="flex flex-col">
            <Icon
              name="sort"
              size="8px"
              className={cn(column.getIsSorted() === 'asc' ? 'text-green' : 'text-offWhite')}
            />

            <Icon
              name="sort"
              size="8px"
              className={cn(
                'rotate-180',
                column.getIsSorted() === 'desc' ? 'text-green' : 'text-offWhite',
              )}
            />
          </div>
        )}
      </div>
    </th>
  </TableCell>
);

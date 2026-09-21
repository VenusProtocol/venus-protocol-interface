import { cn } from '@venusprotocol/ui';

import { Icon } from '../../Icon';
import { TableHeadCell } from '../TableHeadCell';
import { TableHeader } from '../TableHeader';
import { TableRow } from '../TableRow';
import type { TableColumn } from '../types';

interface HeadProps<R> {
  columns: TableColumn<R>[];
  orderBy: TableColumn<R> | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
  onRequestOrder: (column: TableColumn<R>) => void;
  controls: boolean;
  rowControlColumn: boolean;
  className?: string;
}

function Head<R>({
  columns,
  orderBy,
  orderDirection,
  onRequestOrder,
  className,
  controls,
  rowControlColumn,
}: HeadProps<R>) {
  return (
    <TableHeader className={cn('h-14', className)}>
      <TableRow>
        {columns.map(column => {
          const active = orderBy?.key === column.key;
          const orderable = !!column.sortRows || !!column.sortable;
          let ariaSortDirection: 'ascending' | 'descending' | undefined;

          if (active && orderDirection === 'asc') {
            ariaSortDirection = 'ascending';
          }

          if (active && orderDirection === 'desc') {
            ariaSortDirection = 'descending';
          }

          return (
            <TableHeadCell
              key={column.key}
              align={column.align}
              colSpan={column.colSpan}
              aria-sort={ariaSortDirection}
            >
              {(() => {
                const content = (
                  <>
                    <span className="whitespace-nowrap text-grey">{column.label}</span>

                    {controls && orderable && (
                      <div className="-mt-0.5 ml-2">
                        <Icon
                          name="sort"
                          className={cn(
                            'block size-2 fill-white text-white',
                            active && orderDirection === 'asc' && 'fill-green text-green',
                          )}
                        />
                        <Icon
                          name="sort"
                          className={cn(
                            'block size-2 rotate-180 fill-white text-white',
                            active && orderDirection === 'desc' && 'fill-green text-green',
                          )}
                        />
                      </div>
                    )}

                    {active && orderable && (
                      <span className="sr-only">
                        {orderDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    )}
                  </>
                );

                const contentClassName = cn(
                  'inline-flex items-center border-0 bg-transparent p-0 align-middle text-b1r text-grey normal-case',
                  orderable ? 'cursor-pointer' : 'cursor-auto',
                  column.align === 'center' && 'justify-center',
                  column.align === 'right' && 'justify-end',
                );

                return orderable ? (
                  <button
                    type="button"
                    className={contentClassName}
                    onClick={() => onRequestOrder(column)}
                  >
                    {content}
                  </button>
                ) : (
                  <div className={contentClassName}>{content}</div>
                );
              })()}
            </TableHeadCell>
          );
        })}

        {rowControlColumn && <TableHeadCell className="w-8" />}
      </TableRow>
    </TableHeader>
  );
}

export default Head;

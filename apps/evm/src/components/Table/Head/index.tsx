import { cn } from '@venusprotocol/ui';

import { Icon } from '../../Icon';
import { TableHeadCell } from '../TableHeadCell';
import { TableHeader } from '../TableHeader';
import { TableRow } from '../TableRow';
import type { TableColumn } from '../types';

const STICKY_CELL_CLASSES =
  'sticky top-0 z-10 bg-table-header shadow-[inset_0_-1px_0_var(--color-border-subtle)]';

interface HeadProps<R> {
  columns: TableColumn<R>[];
  orderBy: TableColumn<R> | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
  onRequestOrder: (column: TableColumn<R>) => void;
  controls: boolean;
  rowControlColumn: boolean;
  isCompact: boolean;
  isSticky: boolean;
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
  isCompact,
  isSticky,
}: HeadProps<R>) {
  return (
    <TableHeader className={cn(isCompact ? 'h-10' : 'h-14', className)}>
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
              className={cn(isCompact && 'px-3 md:px-6', isSticky && STICKY_CELL_CLASSES)}
            >
              {(() => {
                const content = (
                  <>
                    <span className="whitespace-nowrap text-secondary">{column.label}</span>

                    {controls && orderable && (
                      <div className="-mt-0.5 ml-2">
                        <Icon
                          name="sort"
                          className={cn(
                            'block size-2 fill-primary text-primary',
                            active && orderDirection === 'asc' && 'fill-success text-success',
                          )}
                        />
                        <Icon
                          name="sort"
                          className={cn(
                            'block size-2 rotate-180 fill-primary text-primary',
                            active && orderDirection === 'desc' && 'fill-success text-success',
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
                  'inline-flex items-center border-0 bg-transparent p-0 align-middle text-b1r text-secondary normal-case',
                  orderable ? 'cursor-pointer' : 'cursor-auto',
                  isCompact && 'max-md:min-h-11 max-md:text-base',
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

        {rowControlColumn && (
          <TableHeadCell className={cn('w-8', isSticky && STICKY_CELL_CLASSES)} />
        )}
      </TableRow>
    </TableHeader>
  );
}

export default Head;

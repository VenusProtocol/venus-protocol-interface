import {
  type ColumnDef,
  type Row,
  type SortingState,
  type TableState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Card, Spinner } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { cn } from 'utilities';
import { TableCell } from './TableCell';
import { TableHead } from './TableHead';
import { TableRow } from './TableRow';

export type TableColumn<TData> = ColumnDef<TData>;

export interface TableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<TData>[];
  data: TData[];
  initialState?: Partial<TableState>;
  className?: string;
  isFetching?: boolean;
  onRowClick?: (e: React.MouseEvent<HTMLDivElement>, row: Row<TData>) => void;
}

export function Table<TData>({
  columns,
  data,
  initialState,
  onRowClick,
  isFetching = false,
  className,
  title,
  ...otherProps
}: TableProps<TData>) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      ...initialState,
      sorting: !sorting.length && initialState?.sorting?.length ? initialState?.sorting : sorting,
    },
  });

  return (
    <Card className={cn('px-0 sm:px-0 overflow-clip', className)} {...otherProps}>
      {!!title && <h3 className="text-lg mb-4 px-4 xl:px-6">{title}</h3>}

      <div className="w-full overflow-clip overflow-x-auto scrollbar-hidden bg-cards">
        {isFetching && (
          <div className="w-full flex items-center justify-center h-14">
            <Spinner />
          </div>
        )}

        {(!isFetching || table.getRowModel().rows.length > 0) && (
          <table className="w-full">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    align={index === 0 ? 'left' : 'right'}
                    column={header.column}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}

            <tbody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id} onClick={onRowClick ? e => onRowClick(e, row) : undefined}>
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      align={index === 0 ? 'left' : 'right'}
                      className={cell.column.columnDef.meta?.className}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </table>
        )}

        {!isFetching && table.getRowModel().rows.length === 0 && (
          <div className="w-full flex items-center justify-center h-14">
            {t('table.noResultPlaceholder')}
          </div>
        )}
      </div>
    </Card>
  );
}

import { cn } from '@venusprotocol/ui';

import { Delimiter } from 'components/Delimiter';
import { LabeledInlineContent } from 'components/LabeledInlineContent';
import type { Order, TableColumn } from 'components/Table';

export interface CompactTableCardListProps<R> {
  columns: TableColumn<R>[];
  data: R[];
  rowKeyExtractor: (row: R) => string;
  order?: Order<R>;
  className?: string;
  onRowClick?: (row: R) => void;
  renderRowAction?: (row: R, rowIndex: number) => React.ReactNode;
  renderRowFooter?: (row: R, rowIndex: number) => React.ReactNode;
}

export const CompactTableCardList = <R,>({
  columns,
  data,
  rowKeyExtractor,
  order,
  className,
  onRowClick,
  renderRowAction,
  renderRowFooter,
}: CompactTableCardListProps<R>) => {
  const [titleColumn, ...otherColumns] = columns;
  const sortRows = order?.orderBy.sortRows;

  const sortedData =
    sortRows && order
      ? [...data].sort((rowA, rowB) => sortRows(rowA, rowB, order.orderDirection))
      : data;

  return (
    <div className={cn('space-y-4', className)}>
      {sortedData.map((row, rowIndex) => {
        const rowKey = rowKeyExtractor(row);

        return (
          <div className="space-y-4" key={rowKey}>
            <div>
              <div
                className={cn(
                  'block w-full space-y-4 text-left p-4 rounded-xl',
                  onRowClick && 'cursor-pointer hover:bg-dark-grey',
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                <div>{titleColumn.renderCell(row, rowIndex)}</div>

                <div className="grid grid-cols-2 gap-3">
                  {otherColumns.map((column, index) => (
                    <LabeledInlineContent
                      label={column.label}
                      key={`${rowKey}-${column.key}`}
                      className={cn(
                        otherColumns.length % 2 !== 0 &&
                          index === otherColumns.length - 1 &&
                          !renderRowAction &&
                          'col-span-2',
                      )}
                    >
                      {column.renderCell(row, rowIndex)}
                    </LabeledInlineContent>
                  ))}

                  {renderRowAction?.(row, rowIndex)}
                </div>
              </div>

              {renderRowFooter && <div className="mx-4">{renderRowFooter(row, rowIndex)}</div>}
            </div>

            {rowIndex < sortedData.length - 1 && <Delimiter className="mx-4" />}
          </div>
        );
      })}
    </div>
  );
};

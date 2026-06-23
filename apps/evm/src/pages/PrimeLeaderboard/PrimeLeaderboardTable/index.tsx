import { cn } from '@venusprotocol/ui';

import { Pagination, Table, type TableColumn, type TableProps } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';

// Shared across the rank and reward tables so both display the same number of rows per page
export const ITEMS_PER_PAGE = 10;

export interface PrimeLeaderboardTableProps<R> {
  columns: TableColumn<R>[];
  data: R[];
  itemsCount: number;
  pageParamKey: string;
  rowKeyExtractor: (row: R) => string;
  isFetching?: boolean;
  initialOrder?: TableProps<R>['initialOrder'];
  breakpoint?: TableProps<R>['breakpoint'];
  hideCardDelimiter?: TableProps<R>['hideCardDelimiter'];
  className?: string;
}

export function PrimeLeaderboardTable<R>({
  columns,
  data,
  itemsCount,
  pageParamKey,
  rowKeyExtractor,
  isFetching,
  initialOrder,
  breakpoint,
  hideCardDelimiter,
  className,
}: PrimeLeaderboardTableProps<R>) {
  const { setCurrentPage } = useUrlPagination({ paramKey: pageParamKey });

  return (
    <div className={cn('flex flex-col', className)}>
      <Table
        variant="primary"
        breakpoint={breakpoint}
        hideCardDelimiter={hideCardDelimiter}
        className="border-0 p-0"
        columns={columns}
        data={data}
        isFetching={isFetching}
        rowKeyExtractor={rowKeyExtractor}
        initialOrder={initialOrder}
      />

      <Pagination
        itemsCount={itemsCount}
        itemsPerPageCount={ITEMS_PER_PAGE}
        paramKey={pageParamKey}
        onChange={setCurrentPage}
      />
    </div>
  );
}

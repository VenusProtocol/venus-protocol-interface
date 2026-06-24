import { cn } from '@venusprotocol/ui';
import { useRef } from 'react';

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
  order?: TableProps<R>['order'];
  onOrderChange?: TableProps<R>['onOrderChange'];
  controls?: TableProps<R>['controls'];
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
  order,
  onOrderChange,
  controls,
  breakpoint,
  hideCardDelimiter,
  className,
}: PrimeLeaderboardTableProps<R>) {
  const { setCurrentPage } = useUrlPagination({ paramKey: pageParamKey });
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={cn('flex flex-col', className)}>
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
        order={order}
        onOrderChange={onOrderChange}
        controls={controls}
      />

      <Pagination
        itemsCount={itemsCount}
        itemsPerPageCount={ITEMS_PER_PAGE}
        paramKey={pageParamKey}
        onChange={setCurrentPage}
        scrollToRef={containerRef}
      />
    </div>
  );
}

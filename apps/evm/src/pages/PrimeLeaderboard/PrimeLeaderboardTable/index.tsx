import { cn } from '@venusprotocol/ui';

import { Pagination, Table, type TableColumn, type TableProps } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';

// Shared across the rank and reward tables so both display the same number of rows per page
const ITEMS_PER_PAGE = 10;

export interface PrimeLeaderboardTableProps<R> {
  columns: TableColumn<R>[];
  data: R[];
  pageParamKey: string;
  rowKeyExtractor: (row: R) => string;
  initialOrder?: TableProps<R>['initialOrder'];
  className?: string;
}

export function PrimeLeaderboardTable<R>({
  columns,
  data,
  pageParamKey,
  rowKeyExtractor,
  initialOrder,
  className,
}: PrimeLeaderboardTableProps<R>) {
  const { currentPage, setCurrentPage } = useUrlPagination({ paramKey: pageParamKey });

  const pageData = data.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className={cn('flex flex-col', className)}>
      <Table
        variant="primary"
        className="border-0 p-0"
        columns={columns}
        data={pageData}
        rowKeyExtractor={rowKeyExtractor}
        initialOrder={initialOrder}
      />

      <Pagination
        itemsCount={data.length}
        itemsPerPageCount={ITEMS_PER_PAGE}
        paramKey={pageParamKey}
        onChange={setCurrentPage}
      />
    </div>
  );
}

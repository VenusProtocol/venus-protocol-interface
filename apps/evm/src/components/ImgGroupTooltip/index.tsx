import { cn } from '@venusprotocol/ui';

import { ImgGroup, type ImgGroupItem } from '../ImgGroup';
import { Table, type TableColumn, type TableProps } from '../Table';
import { Tooltip } from '../Tooltip';

export interface ImgGroupTooltipProps<R> {
  imgs: ImgGroupItem[];
  data: R[];
  columns: TableColumn<R>[];
  rowKeyExtractor: (row: R) => string;
  rowOnClick?: TableProps<R>['rowOnClick'];
  getRowClassName?: TableProps<R>['getRowClassName'];
  tableLayout?: TableProps<R>['tableLayout'];
  removeDuplicates?: boolean;
  className?: string;
  contentClassName?: string;
}

export function ImgGroupTooltip<R>({
  imgs,
  data,
  columns,
  rowKeyExtractor,
  rowOnClick,
  getRowClassName,
  tableLayout,
  removeDuplicates,
  className,
  contentClassName,
}: ImgGroupTooltipProps<R>) {
  return (
    <Tooltip
      content={
        <Table
          data={data}
          rowKeyExtractor={rowKeyExtractor}
          columns={columns}
          rowOnClick={rowOnClick}
          getRowClassName={getRowClassName}
          variant="secondary"
          tableLayout={tableLayout}
          stickyHeader
          className="border-0 bg-transparent p-0"
          tableRowClassName="h-12"
          tableHeaderClassName="h-10"
          tableContainerClassName="max-h-80 rounded-md"
        />
      }
      className={cn('inline-flex', className)}
      contentClassName={cn('p-1.5', contentClassName)}
    >
      <ImgGroup imgs={imgs} removeDuplicates={removeDuplicates} limit={4} />
    </Tooltip>
  );
}

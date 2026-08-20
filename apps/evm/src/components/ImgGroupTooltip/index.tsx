import { cn } from '@venusprotocol/ui';

import { ImgGroup } from '../ImgGroup';
import { Table, type TableColumn, type TableProps } from '../Table';
import { Tooltip } from '../Tooltip';

export interface ImgGroupTooltipProps<R> {
  imgSrcs: string[];
  data: R[];
  columns: TableColumn<R>[];
  rowKeyExtractor: (row: R) => string;
  rowOnClick?: TableProps<R>['rowOnClick'];
  tableLayout?: TableProps<R>['tableLayout'];
  removeDuplicates?: boolean;
  className?: string;
  contentClassName?: string;
}

// Shared icon-stack trigger with a tabular popover, used wherever a cell needs to condense a list of
// entities (yield group exposure, source collaterals, fund rating agencies) into stacked icons. The
// header stays visible while the rows scroll, and the popover flips rather than clipping since
// Tooltip is collision-aware
export function ImgGroupTooltip<R>({
  imgSrcs,
  data,
  columns,
  rowKeyExtractor,
  rowOnClick,
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
          variant="secondary"
          tableLayout={tableLayout}
          className="border-0 p-0"
          tableRowClassName="h-12"
          tableHeaderClassName="sticky top-0 z-10 h-12 bg-dark-blue"
          tableContainerClassName="max-h-49"
        />
      }
      className={cn('inline-flex', className)}
      contentClassName={cn('p-0', contentClassName)}
    >
      <ImgGroup imgSrcs={imgSrcs} removeDuplicates={removeDuplicates} limit={5} />
    </Tooltip>
  );
}

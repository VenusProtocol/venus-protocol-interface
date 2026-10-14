import { AccordionAnimatedContent, Table } from 'components';
import type { LiquidityHubSource, LiquidityHubYieldGroup, Token } from 'types';
import { COLUMN_WIDTHS } from '../../columnWidths';
import { CardList } from './CardList';
import { useColumns } from './useColumns';

export interface RowFooterProps {
  row: LiquidityHubYieldGroup;
  underlyingToken: Token;
  isOpen: boolean;
}

export const RowFooter: React.FC<RowFooterProps> = ({ row, underlyingToken, isOpen }) => {
  const columns = useColumns({
    yieldGroup: row,
    underlyingToken,
  });

  const orderByColumn = columns.find(column => column.key === 'apy');
  const initialOrder = orderByColumn && {
    orderBy: orderByColumn,
    orderDirection: 'desc' as const,
  };

  // The card list renders sources in the order it receives them, so they arrive sorted the same
  // way the table orders them through initialOrder
  const sortRows = orderByColumn?.sortRows;
  const sources = sortRows
    ? [...row.sources].sort((sourceA, sourceB) => sortRows(sourceA, sourceB, 'desc'))
    : row.sources;

  const rowKeyExtractor = (row: LiquidityHubSource) => row.address;

  return (
    <AccordionAnimatedContent className="flex flex-col pb-2" isOpen={isOpen}>
      <CardList
        className="space-y-4 md:hidden lg:block 2xl:hidden"
        rowKeyExtractor={rowKeyExtractor}
        sources={sources}
        columns={columns}
      />

      <div className="hidden md:block lg:hidden 2xl:block">
        <Table
          columns={columns}
          columnWidths={COLUMN_WIDTHS}
          data={sources}
          rowKeyExtractor={rowKeyExtractor}
          initialOrder={initialOrder}
          variant="primary"
          tableLayout="fixed"
          className="bg-dark-blue"
        />
      </div>
    </AccordionAnimatedContent>
  );
};

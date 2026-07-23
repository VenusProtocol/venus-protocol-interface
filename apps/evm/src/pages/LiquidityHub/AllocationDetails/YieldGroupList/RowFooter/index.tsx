import { AccordionAnimatedContent, Table } from 'components';
import type { LiquidityHubSource, LiquidityHubYieldGroup, Token } from 'types';
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

  const orderByColumn = columns.find(column => column.key === 'averageApy');
  const initialOrder = orderByColumn && {
    orderBy: orderByColumn,
    orderDirection: 'desc' as const,
  };

  const rowKeyExtractor = (row: LiquidityHubSource) => row.address;

  return (
    <AccordionAnimatedContent className="flex flex-col pb-2" isOpen={isOpen}>
      <CardList
        className="space-y-4 md:hidden lg:block 2xl:hidden"
        rowKeyExtractor={rowKeyExtractor}
        sources={row.sources}
        columns={columns}
      />

      <div className="hidden md:block lg:hidden 2xl:block">
        <Table
          columns={columns}
          data={row.sources}
          rowKeyExtractor={rowKeyExtractor}
          initialOrder={initialOrder}
          variant="primary"
          tableLayout="auto"
          className="bg-dark-blue"
        />
      </div>
    </AccordionAnimatedContent>
  );
};

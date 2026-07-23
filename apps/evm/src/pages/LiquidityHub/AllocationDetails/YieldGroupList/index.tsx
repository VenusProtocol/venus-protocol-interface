import { useState } from 'react';

import { CompactTableCardList, Table } from 'components';
import type { LiquidityHub, LiquidityHubYieldGroup } from 'types';
import { RowFooter } from './RowFooter';
import { useColumns } from './useColumns';

export interface YieldGroupListProps {
  liquidityHub: LiquidityHub;
}

export const YieldGroupList: React.FC<YieldGroupListProps> = ({ liquidityHub }) => {
  const [openPositionAccordionKeys, setOpenAccordionKeys] = useState<string[]>([]);

  const rowKeyExtractor = (row: LiquidityHubYieldGroup) => row.address;

  const renderRowFooter = (row: LiquidityHubYieldGroup) => {
    const isOpen = openPositionAccordionKeys.includes(rowKeyExtractor(row));

    return (
      <RowFooter row={row} underlyingToken={liquidityHub.vhToken.underlyingToken} isOpen={isOpen} />
    );
  };

  const handleRowClick = (row: LiquidityHubYieldGroup) => {
    const rowKey = rowKeyExtractor(row);

    setOpenAccordionKeys(currOpenKeys =>
      currOpenKeys.includes(rowKey)
        ? currOpenKeys.filter(key => key !== rowKey)
        : [...currOpenKeys, rowKey],
    );
  };

  const columns = useColumns({ openPositionAccordionKeys, rowKeyExtractor });

  const orderByColumn = columns.find(column => column.key === 'averageApy');
  const initialOrder = orderByColumn && {
    orderBy: orderByColumn,
    orderDirection: 'desc' as const,
  };

  return (
    <div className="px-2">
      <CompactTableCardList
        className="md:hidden lg:block 2xl:hidden"
        columns={columns}
        data={liquidityHub.yieldGroups}
        rowKeyExtractor={rowKeyExtractor}
        order={initialOrder}
        onRowClick={handleRowClick}
        renderRowFooter={renderRowFooter}
      />

      <div className="hidden md:block lg:hidden 2xl:block">
        <Table
          columns={columns}
          data={liquidityHub.yieldGroups}
          rowKeyExtractor={rowKeyExtractor}
          initialOrder={initialOrder}
          variant="secondary"
          className="border-0"
          tableLayout="auto"
          rowOnClick={(_event, row) => handleRowClick(row)}
          renderRowFooter={renderRowFooter}
          size="sm"
        />
      </div>
    </div>
  );
};

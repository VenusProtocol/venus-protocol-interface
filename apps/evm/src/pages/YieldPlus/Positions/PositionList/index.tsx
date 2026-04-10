import { Table } from 'components';
import { useMemo, useState } from 'react';

import {
  LONG_TOKEN_ADDRESS_PARAM_KEY,
  SHORT_TOKEN_ADDRESS_PARAM_KEY,
} from 'pages/YieldPlus/constants';
import { useSearchParams } from 'react-router';
import type { YieldPlusPosition } from 'types';
import { RowFooter } from './RowFooter';
import { rowKeyExtractor } from './rowKeyExtractor';
import { useColumns } from './useColumns';

export interface PositionListProps {
  positions: YieldPlusPosition[];
}

export const PositionList: React.FC<PositionListProps> = ({ positions }) => {
  const [_, setSearchParams] = useSearchParams();
  const [openPositionAccordionKeys, setOpenAccordionKeys] = useState<string[]>([]);

  const selectPosition = (row: YieldPlusPosition) => {
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: row.longAsset.vToken.underlyingToken.address,
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: row.shortAsset.vToken.underlyingToken.address,
    }));
  };

  const handleRowClick = (_e: React.MouseEvent<HTMLDivElement>, row: YieldPlusPosition) =>
    selectPosition(row);

  const renderRowFooter = (row: YieldPlusPosition) => {
    const isOpen = openPositionAccordionKeys.includes(rowKeyExtractor(row));

    return <RowFooter row={row} isOpen={isOpen} />;
  };

  const handleAccordionClick = (row: YieldPlusPosition) => {
    const rowKey = rowKeyExtractor(row);

    setOpenAccordionKeys(currOpenKeys =>
      currOpenKeys.includes(rowKey)
        ? currOpenKeys.filter(key => key !== rowKey)
        : [...currOpenKeys, rowKey],
    );
  };

  const columns = useColumns({
    openPositionAccordionKeys,
    onPositionAccordionClick: handleAccordionClick,
    rowKeyExtractor,
  });
  const initialOrder = useMemo(() => {
    const orderByColumn = columns.find(column => column.key === 'pnl');

    return (
      orderByColumn && {
        orderBy: orderByColumn,
        orderDirection: 'desc' as const,
      }
    );
  }, [columns]);

  return (
    <Table
      columns={columns}
      data={positions}
      rowKeyExtractor={rowKeyExtractor}
      initialOrder={initialOrder}
      breakpoint="xl"
      variant="primary"
      className="py-0 border-0 xl:border"
      tableLayout="auto"
      rowOnClick={handleRowClick}
      renderRowFooter={renderRowFooter}
    />
  );
};

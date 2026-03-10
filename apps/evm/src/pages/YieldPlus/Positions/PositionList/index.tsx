import { Table } from 'components';
import { useMemo, useState } from 'react';

import { PAGE_CONTAINER_ID } from 'constants/layout';
import { useTranslation } from 'libs/translations';
import {
  LONG_TOKEN_ADDRESS_PARAM_KEY,
  SHORT_TOKEN_ADDRESS_PARAM_KEY,
} from 'pages/YieldPlus/constants';
import { useTokenPair } from 'pages/YieldPlus/useTokenPair';
import { useSearchParams } from 'react-router';
import type { YieldPlusPosition } from 'types';
import { areTokensEqual } from 'utilities';
import { RowFooter } from './RowFooter';
import { rowKeyExtractor } from './rowKeyExtractor';
import { useColumns } from './useColumns';

export interface PositionListProps {
  positions: YieldPlusPosition[];
}

export const PositionList: React.FC<PositionListProps> = ({ positions }) => {
  const { t } = useTranslation();
  const [_, setSearchParams] = useSearchParams();
  const [openPositionAccordionKeys, setOpenAccordionKeys] = useState<string[]>([]);
  const { shortToken, longToken } = useTokenPair();

  const handleRowClick = (_e: React.MouseEvent<HTMLDivElement>, row: YieldPlusPosition) => {
    // Open accordion if the selected token pair corresponds to the clicked row
    if (
      areTokensEqual(row.shortAsset.vToken.underlyingToken, shortToken) &&
      areTokensEqual(row.longAsset.vToken.underlyingToken, longToken)
    ) {
      const rowKey = rowKeyExtractor(row);

      setOpenAccordionKeys(currOpenKeys =>
        currOpenKeys.includes(rowKey)
          ? currOpenKeys.filter(key => key !== rowKey)
          : [...currOpenKeys, rowKey],
      );

      return;
    }

    // Otherwise select the pair related to the clicked row
    document.getElementById(PAGE_CONTAINER_ID)?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: row.longAsset.vToken.underlyingToken.address,
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: row.shortAsset.vToken.underlyingToken.address,
    }));
  };

  const renderRowFooter = (row: YieldPlusPosition) => {
    const isOpen = openPositionAccordionKeys.includes(rowKeyExtractor(row));

    return <RowFooter row={row} isOpen={isOpen} />;
  };

  const renderRowControl = (_row: YieldPlusPosition) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // TODO: open "Close" modal
    };

    return (
      <button
        onClick={handleClick}
        className="-ml-2 text-b2s px-2 py-1 rounded-lg border border-dark-blue-hover text-light-grey transition-colors cursor-pointer hover:bg-dark-blue-hover"
        type="button"
      >
        {t('yieldPlus.positions.closeButtonLabel')}
      </button>
    );
  };

  const columns = useColumns({
    openPositionAccordionKeys,
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
      renderRowControl={renderRowControl}
    />
  );
};

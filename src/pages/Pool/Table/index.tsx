/** @jsxImportSource @emotion/react */
import React from 'react';

import { routes } from 'constants/routing';
import { MarketTable } from 'containers/MarketTable';
import { Asset, Pool } from 'types';

export interface TableProps {
  pool: Pool;
}

export const Table: React.FC<TableProps> = ({ pool }) => {
  const getRowHref = (row: Asset) => {
    if (pool.isIsolated) {
      return routes.isolatedPoolMarket.path
        .replace(':poolComptrollerAddress', pool.comptrollerAddress)
        .replace(':vTokenAddress', row.vToken.address);
    }

    return routes.corePoolMarket.path.replace(':vTokenAddress', row.vToken.address);
  };

  return (
    <MarketTable
      getRowHref={getRowHref}
      pools={[pool]}
      breakpoint="xl"
      columns={[
        'asset',
        'supplyBalance',
        'labeledSupplyApyLtv',
        'borrowBalance',
        'labeledBorrowApy',
        'liquidity',
        'price',
      ]}
      initialOrder={{
        orderBy: 'liquidity',
        orderDirection: 'desc',
      }}
    />
  );
};

export default Table;

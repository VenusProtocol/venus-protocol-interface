/** @jsxImportSource @emotion/react */
import { routes } from 'constants/routing';
import { MarketTable } from 'containers/MarketTable';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { Asset, Pool } from 'types';
import { areAddressesEqual } from 'utilities';

export interface TableProps {
  pool: Pool;
}

export const Table: React.FC<TableProps> = ({ pool }) => {
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  const getRowHref = (row: Asset) => {
    if (areAddressesEqual(pool.comptrollerAddress, corePoolComptrollerContractAddress)) {
      return routes.corePoolMarket.path.replace(':vTokenAddress', row.vToken.address);
    }

    return routes.isolatedPoolMarket.path
      .replace(':poolComptrollerAddress', pool.comptrollerAddress)
      .replace(':vTokenAddress', row.vToken.address);
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
        orderBy: 'labeledSupplyApyLtv',
        orderDirection: 'desc',
      }}
    />
  );
};

export default Table;

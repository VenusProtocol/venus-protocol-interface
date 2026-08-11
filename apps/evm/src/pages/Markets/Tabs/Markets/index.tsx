import { type ColumnKey, MarketTable } from 'containers/MarketTable';
import { useChain } from 'hooks/useChain';
import type { Pool } from 'types';
import { areAddressesEqual } from 'utilities';

// TODO: add tests

const marketTableColumns: ColumnKey[] = [
  'asset',
  'supplyBalance',
  'labeledSupplyApy',
  'borrowBalance',
  'labeledBorrowApy',
  'liquidity',
];

export interface MarketsProps {
  pool: Pool;
}

export const Markets: React.FC<MarketsProps> = ({ pool }) => {
  const { corePoolComptrollerContractAddress } = useChain();
  const isCorePool = areAddressesEqual(pool.comptrollerAddress, corePoolComptrollerContractAddress);

  return (
    <div className="space-y-6">
      <MarketTable
        assets={pool.assets}
        categories={isCorePool ? pool.categories : undefined}
        poolName={pool.name}
        poolComptrollerContractAddress={pool.comptrollerAddress}
        userEModeGroup={pool.userEModeGroup}
        eModeGroups={pool.eModeGroups}
        initialOrder={{
          orderBy: 'labeledSupplyApy',
          orderDirection: 'desc',
        }}
        columns={marketTableColumns}
        breakpoint="md"
        controls={true}
      />
    </div>
  );
};

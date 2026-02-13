import { type ColumnKey, MarketTable } from 'containers/MarketTable';
import type { Pool } from 'types';

const marketTableColumns: ColumnKey[] = [
  'assetAndChain',
  'supplyBalance',
  'labeledSupplyApy',
  'borrowBalance',
  'labeledBorrowApy',
  'liquidity',
];

export interface MarketsProps {
  pool: Pool;
}

export const Markets: React.FC<MarketsProps> = ({ pool }) => (
  <div className="space-y-6">
    <MarketTable
      assets={pool.assets}
      poolName={pool.name}
      poolComptrollerContractAddress={pool.comptrollerAddress}
      userEModeGroup={pool.userEModeGroup}
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

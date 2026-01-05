import { MarketTable } from 'containers/MarketTable';
import { PoolStats } from 'containers/PoolStats';
import type { Pool } from 'types';
import { AdBanner } from './AdBanner';

export interface AssetsProps {
  pool: Pool;
}

export const Assets: React.FC<AssetsProps> = ({ pool }) => (
  <div className="space-y-6 sm:space-y-4">
    <PoolStats pools={[pool]} stats={['supply', 'borrow', 'liquidity', 'assetCount']} />

    <MarketTable
      assets={pool.assets}
      poolName={pool.name}
      poolComptrollerContractAddress={pool.comptrollerAddress}
      userEModeGroup={pool.userEModeGroup}
      breakpoint="lg"
      columns={[
        'asset',
        'supplyBalance',
        'labeledSupplyApy',
        'borrowBalance',
        'labeledBorrowApy',
        'liquidity',
      ]}
      initialOrder={{
        orderBy: 'labeledSupplyApy',
        orderDirection: 'desc',
      }}
      header={<AdBanner />}
    />
  </div>
);

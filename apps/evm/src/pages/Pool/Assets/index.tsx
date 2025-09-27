import { EModeBanner } from 'components';
import { MarketTable } from 'containers/MarketTable';
import { PoolStats } from 'containers/PoolStats';
import type { Pool } from 'types';

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
      header={
        pool.eModeGroups.length > 0 && (
          <EModeBanner
            className="lg:mt-4"
            poolComptrollerContractAddress={pool.comptrollerAddress}
            analyticVariant="pool_banner"
            enabledEModeGroupName={pool.userEModeGroup?.name}
          />
        )
      }
    />
  </div>
);

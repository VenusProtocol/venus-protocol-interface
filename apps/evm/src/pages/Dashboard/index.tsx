import { cn } from '@venusprotocol/ui';
import { useState } from 'react';

import { useGetPools } from 'clients/api';
import { Page, type Tag, TagGroup } from 'components';
import { MarketTable } from 'containers/MarketTable';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { isAssetPaused } from 'utilities';

import { PoolStats } from 'containers/PoolStats';
import { Carousel } from './Carousel';
import TEST_IDS from './testIds';
import { useMarketTableColumns } from './useMarketTableColumns';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { data: getPools, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });
  const pools = getPools?.pools || [];

  const [_selectedPoolTagIndex, setSelectedPoolTagIndex] = useState<number>(0);
  const selectedPoolTagIndex = _selectedPoolTagIndex <= pools.length ? _selectedPoolTagIndex : 0;

  const filteredPools = selectedPoolTagIndex > 0 ? [pools[selectedPoolTagIndex - 1]] : pools;

  const columns = useMarketTableColumns();

  const poolTags: Tag[] = [
    {
      id: 'all',
      content: t('dashboard.allTag'),
    },
  ].concat(
    pools.map((pool, poolIndex) => {
      const isPaused = pool.assets.every(asset =>
        isAssetPaused({
          disabledTokenActions: asset.disabledTokenActions,
        }),
      );

      return {
        id: pool.comptrollerAddress,
        content: pool.name,
        className: cn(
          'transition-colors',
          isPaused && selectedPoolTagIndex - 1 !== poolIndex && 'text-grey',
        ),
      };
    }),
  );

  return (
    <Page>
      <Carousel />

      <PoolStats
        className="my-6"
        pools={pools}
        stats={['supply', 'borrow', 'liquidity', 'treasury', 'dailyXvsDistribution', 'assetCount']}
      />

      {pools.length > 0 && (
        <TagGroup
          tags={poolTags}
          activeTagIndex={selectedPoolTagIndex}
          onTagClick={setSelectedPoolTagIndex}
          className="-mx-4 px-4 md:mx-0 md:px-0 mb-6 mt-8 lg:mr-6 grow"
        />
      )}

      <MarketTable
        pools={filteredPools}
        isFetching={isGetPoolsLoading}
        breakpoint="xl"
        columns={columns}
        marketType="supply"
        initialOrder={{
          orderBy: 'labeledSupplyApy',
          orderDirection: 'desc',
        }}
        data-testid={TEST_IDS.marketTable}
        key="dashboard-market-table"
      />
    </Page>
  );
};

export default Dashboard;

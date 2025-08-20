import { cn } from '@venusprotocol/ui';
import { useSearchParams } from 'react-router';

import { useGetPools } from 'clients/api';
import { Page, TagGroup } from 'components';
import { MarketTable, type MarketTableProps } from 'containers/MarketTable';
import { PoolStats } from 'containers/PoolStats';
import { Redirect } from 'containers/Redirect';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetHomePagePath } from 'hooks/useGetHomePagePath';
import { useAccountAddress } from 'libs/wallet';
import { useEffect } from 'react';
import type { Pool } from 'types';
import { areAddressesEqual, isAssetPaused } from 'utilities';
import TEST_IDS from './testIds';

export const POOL_COMPTROLLER_ADDRESS_PARAM_KEY = 'pool';

const isPoolPaused = ({ pool }: { pool: Pool }) =>
  pool.assets.every(asset =>
    isAssetPaused({
      disabledTokenActions: asset.disabledTokenActions,
    }),
  );

export const IsolatedPools: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const [searchParams, setSearchParams] = useSearchParams();

  const { corePoolComptrollerContractAddress } = useGetChainMetadata();
  const { homePagePath } = useGetHomePagePath();

  const columns: MarketTableProps['columns'] = [
    'asset',
    'supplyBalance',
    'labeledSupplyApy',
    'borrowBalance',
    'labeledBorrowApy',
  ];

  columns.push('liquidity');

  const { data: getPools, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  const pools = (getPools?.pools || [])
    // Filter out Core pool
    .filter(pool => !areAddressesEqual(pool.comptrollerAddress, corePoolComptrollerContractAddress))
    // Sort paused pools last
    .toSorted((a, b) => {
      const isPoolAPaused = isPoolPaused({ pool: a });
      const isPoolBPaused = isPoolPaused({ pool: b });

      if (isPoolAPaused === isPoolBPaused) {
        return 0;
      }

      return isPoolAPaused ? 1 : -1;
    });

  const selectedPoolComptrollerAddress = searchParams.get(POOL_COMPTROLLER_ADDRESS_PARAM_KEY);
  const selectedPoolTagIndex = selectedPoolComptrollerAddress
    ? pools.findIndex(pool =>
        areAddressesEqual(pool.comptrollerAddress, selectedPoolComptrollerAddress),
      )
    : 0;

  const selectedPool = pools[selectedPoolTagIndex];

  const poolTags = pools.map((pool, poolIndex) => {
    const isPaused = isPoolPaused({ pool });

    return {
      id: pool.comptrollerAddress,
      content: (
        <span
          className={cn(
            'transition-colors',
            isPaused && selectedPoolTagIndex !== poolIndex && 'text-grey opacity-50',
          )}
        >
          {pool.name}
        </span>
      ),
      isPaused,
    };
  });

  // Set default pool search param if none is present in the URL
  useEffect(() => {
    if (!selectedPool && !isGetPoolsLoading && pools.length > 0) {
      setSearchParams(currentSearchParams => ({
        ...Object.fromEntries(currentSearchParams),
        [POOL_COMPTROLLER_ADDRESS_PARAM_KEY]: pools[0].comptrollerAddress,
      }));
    }
  }, [selectedPool, isGetPoolsLoading, pools, setSearchParams]);

  const handleTagClick = (tagIndex: number) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [POOL_COMPTROLLER_ADDRESS_PARAM_KEY]: pools[tagIndex].comptrollerAddress,
    }));

  // Redirect to Core pool page if there are no isolated pools to display
  if (!isGetPoolsLoading && pools.length === 0) {
    return <Redirect to={homePagePath} />;
  }

  return (
    <Page>
      {pools.length > 0 && (
        <TagGroup
          tags={poolTags}
          activeTagIndex={selectedPoolTagIndex}
          onTagClick={handleTagClick}
          className="-mx-4 px-4 md:mx-0 md:px-0 mb-6 grow"
        />
      )}

      <PoolStats
        className="my-6"
        pools={selectedPool ? [selectedPool] : []}
        stats={['supply', 'borrow', 'liquidity', 'assetCount']}
      />

      <MarketTable
        pools={selectedPool ? [selectedPool] : []}
        isFetching={isGetPoolsLoading}
        breakpoint="lg"
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

export default IsolatedPools;

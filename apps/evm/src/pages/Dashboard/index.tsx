import { type InputHTMLAttributes, useMemo, useState } from 'react';

import { useGetPools } from 'clients/api';
import { type Tag, TagGroup, TextField, Toggle } from 'components';
import { MarketTable } from 'containers/MarketTable';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';

import TEST_IDS from './testIds';
import useFormatPools from './useFormatPools';
import { BannerCarousel } from './BannerCarousel';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const [selectedPoolTagIndex, setSelectedPoolTagIndex] = useState<number>(0);
  const [shouldDisplayPausedAssets, setShouldDisplayPausedAssets] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    setSearchValue(changeEvent.currentTarget.value);

  const { data: getPoolData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  const pools = useFormatPools({
    pools: getPoolData?.pools || [],
    searchValue,
    shouldDisplayPausedAssets,
    selectedPoolIndex: selectedPoolTagIndex - 1,
  });

  const poolTags: Tag[] = useMemo(
    () =>
      [
        {
          id: 'all',
          content: t('dashboard.allTag'),
        },
      ].concat(
        (getPoolData?.pools || []).map(pool => ({
          id: pool.comptrollerAddress,
          content: pool.name,
        })),
      ),
    [getPoolData?.pools, t],
  );

  return (
    <>
      <BannerCarousel />

      <div className="mb-6 space-y-6 lg:flex lg:items-center lg:justify-between lg:space-x-6 lg:space-y-0">
        {pools.length > 0 && (
          <TagGroup
            tags={poolTags}
            activeTagIndex={selectedPoolTagIndex}
            onTagClick={setSelectedPoolTagIndex}
            className="mx-[-16px] px-4 md:mx-0 md:px-0 lg:mr-6"
          />
        )}

        <div className="space-y-6 lg:flex lg:items-center lg:space-y-0 lg:space-x-6 ml-auto">
          <Toggle
            onChange={() => setShouldDisplayPausedAssets(currentValue => !currentValue)}
            value={shouldDisplayPausedAssets}
            label={t('dashboard.pausedAssetsToggle.label')}
            className="flex-shrink-0 lg:ml-auto"
            isLight
          />

          <TextField
            className="shrink-0 lg:w-[300px]"
            isSmall
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder={t('dashboard.searchInput.placeholder')}
            leftIconSrc="magnifier"
            variant="secondary"
          />
        </div>
      </div>

      <MarketTable
        pools={pools}
        isFetching={isGetPoolsLoading}
        breakpoint="lg"
        columns={[
          'asset',
          'pool',
          'userWalletBalance',
          'labeledSupplyApyLtv',
          'labeledBorrowApy',
          'liquidity',
        ]}
        marketType="supply"
        initialOrder={{
          orderBy: 'labeledSupplyApyLtv',
          orderDirection: 'desc',
        }}
        testId={TEST_IDS.marketTable}
        key="dashboard-market-table"
      />
    </>
  );
};

export default Dashboard;

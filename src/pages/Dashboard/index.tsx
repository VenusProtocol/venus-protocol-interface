import { Tag, TagGroup, TextField } from 'components';
import { useTranslation } from 'packages/translations';
import { InputHTMLAttributes, useMemo, useState } from 'react';

import { useGetPools } from 'clients/api';
import { MarketTable } from 'containers/MarketTable';
import { useAuth } from 'context/AuthContext';

import { Banner } from './Banner';
import TEST_IDS from './testIds';
import useFormatPools from './useFormatPools';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAuth();

  const [selectedPoolTagIndex, setSelectedPoolTagIndex] = useState<number>(0);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    setSearchValue(changeEvent.currentTarget.value);

  const { data: getPoolData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });
  const pools = useFormatPools({
    pools: getPoolData?.pools || [],
    searchValue,
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
        pools.map(pool => ({
          id: pool.comptrollerAddress,
          content: pool.name,
        })),
      ),
    [pools, t],
  );

  return (
    <>
      <Banner />

      <div className="mb-6 lg:flex lg:items-center lg:justify-between">
        <TextField
          className="mb-6 lg:order-2 lg:mb-0 lg:ml-auto lg:w-[300px]"
          isSmall
          value={searchValue}
          onChange={handleSearchInputChange}
          placeholder={t('dashboard.searchInput.placeholder')}
          leftIconSrc="magnifier"
          variant="secondary"
        />

        {pools.length > 0 && (
          <TagGroup
            className="mx-[-16px] px-4 md:mx-0 md:px-0 lg:order-1 lg:mr-6"
            tags={poolTags}
            activeTagIndex={selectedPoolTagIndex}
            onTagClick={setSelectedPoolTagIndex}
          />
        )}
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
          orderBy: 'userWalletBalance',
          orderDirection: 'desc',
        }}
        testId={TEST_IDS.marketTable}
        key="dashboard-market-table"
      />
    </>
  );
};

export default Dashboard;

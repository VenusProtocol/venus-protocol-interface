import { Link, NoticeWarning, Tag, TagGroup, TextField } from 'components';
import { InputHTMLAttributes, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';

import { useGetPools } from 'clients/api';
import { MarketTable } from 'containers/MarketTable';
import { useAuth } from 'context/AuthContext';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { ConnectWalletBanner } from './ConnectWalletBanner';
import { PrimePromotionalBanner } from './PrimePromotionalBanner';
import TEST_IDS from './testIds';
import useFormatPools from './useFormatPools';

interface DashboardUiProps {
  searchValue: string;
  isPrimeEnabled: boolean;
  onSearchInputChange: (newValue: string) => void;
  pools: Pool[];
  isFetchingPools?: boolean;
}

export const DashboardUi: React.FC<DashboardUiProps> = ({
  pools,
  isPrimeEnabled,
  isFetchingPools,
  searchValue,
  onSearchInputChange,
}) => {
  const { t, Trans } = useTranslation();
  const [selectedPoolTagIndex, setSelectedPoolTagIndex] = useState<number>(0);

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchInputChange(changeEvent.currentTarget.value);

  const formattedPools = useFormatPools({
    pools,
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
    [pools],
  );

  return (
    <>
      {isPrimeEnabled ? <PrimePromotionalBanner /> : <ConnectWalletBanner />}

      <NoticeWarning
        className="mb-6"
        description={
          <Trans
            i18nKey="dashboard.banner.busdForceLiquidations"
            components={{
              Link: (
                <Link href="https://app.venus.io/#/governance/proposal/191" />
              ),
            }}
          />
        }
      />

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
            className="lg:order-1 lg:mr-6"
            tags={poolTags}
            activeTagIndex={selectedPoolTagIndex}
            onTagClick={setSelectedPoolTagIndex}
          />
        )}
      </div>

      <MarketTable
        pools={formattedPools}
        isFetching={isFetchingPools}
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

const Dashboard: React.FC = () => {
  const { accountAddress } = useAuth();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const [searchValue, setSearchValue] = useState('');

  const { data: getPoolData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  return (
    <DashboardUi
      pools={getPoolData?.pools || []}
      isPrimeEnabled={isPrimeEnabled}
      isFetchingPools={isGetPoolsLoading}
      searchValue={searchValue}
      onSearchInputChange={setSearchValue}
    />
  );
};

export default Dashboard;

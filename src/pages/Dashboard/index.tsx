/** @jsxImportSource @emotion/react */
import {
  ButtonGroup,
  NoticeWarning,
  Tag,
  TagGroup,
  TextField,
  TokenAnnouncement,
} from 'components';
import React, { InputHTMLAttributes, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { isFeatureEnabled } from 'utilities';

import { useGetPools } from 'clients/api';
import { MAINNET_TOKENS } from 'constants/tokens';
import { MarketTable, MarketTableProps } from 'containers/MarketTable';
import { useAuth } from 'context/AuthContext';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';

import ConnectWalletBanner from './ConnectWalletBanner';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useFormatPools from './useFormatPools';

interface DashboardUiProps {
  searchValue: string;
  onSearchInputChange: (newValue: string) => void;
  pools: Pool[];
  isFetchingPools?: boolean;
}

export const DashboardUi: React.FC<DashboardUiProps> = ({
  pools,
  isFetchingPools,
  searchValue,
  onSearchInputChange,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedPoolTagIndex, setSelectedPoolTagIndex] = useState<number>(0);

  const showXlDownCss = useShowXlDownCss();
  const hideXlDownCss = useHideXlDownCss();

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

  const supplyMarketTableProps: MarketTableProps = {
    pools: formattedPools,
    isFetching: isFetchingPools,
    marketType: 'supply',
    breakpoint: 'lg',
    columns: isFeatureEnabled('isolatedPools')
      ? ['asset', 'supplyApyLtv', 'pool', 'collateral']
      : ['asset', 'supplyApyLtv', 'userWalletBalance', 'collateral'],
    initialOrder: {
      orderBy: 'supplyApyLtv',
      orderDirection: 'desc',
    },
  };

  const borrowMarketTableProps: MarketTableProps = {
    pools: formattedPools,
    isFetching: isFetchingPools,
    marketType: 'borrow',
    breakpoint: 'lg',
    columns: isFeatureEnabled('isolatedPools')
      ? ['asset', 'borrowApy', 'pool', 'liquidity']
      : ['asset', 'borrowApy', 'userWalletBalance', 'liquidity'],
    initialOrder: {
      orderBy: 'borrowApy',
      orderDirection: 'asc',
    },
  };

  return (
    <>
      <ConnectWalletBanner />

      <NoticeWarning css={styles.banner} description={t('dashboard.banner.borrowApyChange')} />

      <TokenAnnouncement css={styles.banner} token={MAINNET_TOKENS.tusdold} />

      <div css={styles.header}>
        <TextField
          css={[styles.tabletSearchTextField, showXlDownCss]}
          isSmall
          value={searchValue}
          onChange={handleSearchInputChange}
          placeholder={
            isFeatureEnabled('isolatedPools')
              ? t('dashboard.searchInput.placeholderIsolatedPools')
              : t('dashboard.searchInput.placeholder')
          }
          leftIconSrc="magnifier"
          variant="secondary"
        />

        {!isFeatureEnabled('isolatedPools') && (
          <ButtonGroup
            css={[styles.tabletButtonGroup, showXlDownCss]}
            fullWidth
            buttonLabels={[t('dashboard.supplyTabTitle'), t('dashboard.borrowTabTitle')]}
            activeButtonIndex={activeTabIndex}
            onButtonClick={setActiveTabIndex}
          />
        )}

        <div css={styles.headerBottomRow}>
          {isFeatureEnabled('isolatedPools') && pools.length > 0 && (
            <TagGroup
              css={styles.tags}
              tags={poolTags}
              activeTagIndex={selectedPoolTagIndex}
              onTagClick={setSelectedPoolTagIndex}
            />
          )}

          <div css={styles.rightColumn}>
            <TextField
              css={[styles.desktopSearchTextField, hideXlDownCss]}
              isSmall
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder={
                isFeatureEnabled('isolatedPools')
                  ? t('dashboard.searchInput.placeholderIsolatedPools')
                  : t('dashboard.searchInput.placeholder')
              }
              leftIconSrc="magnifier"
              variant="secondary"
            />
          </div>
        </div>
      </div>

      {isFeatureEnabled('isolatedPools') ? (
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
      ) : (
        <>
          <div css={[styles.desktopMarketTables, hideXlDownCss]}>
            <MarketTable
              {...supplyMarketTableProps}
              title={t('dashboard.supplyMarketTableTitle')}
              testId={TEST_IDS.supplyMarketTable}
            />

            <MarketTable
              {...borrowMarketTableProps}
              title={t('dashboard.borrowMarketTableTitle')}
              testId={TEST_IDS.borrowMarketTable}
            />
          </div>

          <div css={showXlDownCss}>
            {activeTabIndex === 0 ? (
              <MarketTable {...supplyMarketTableProps} key="dashboard-supply-market-table" />
            ) : (
              <MarketTable {...borrowMarketTableProps} key="dashboard-borrow-market-table" />
            )}
          </div>
        </>
      )}
    </>
  );
};

const Dashboard: React.FC = () => {
  const { accountAddress } = useAuth();

  const [searchValue, setSearchValue] = useState('');

  const { data: getPoolData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  return (
    <DashboardUi
      pools={getPoolData?.pools || []}
      isFetchingPools={isGetPoolsLoading}
      searchValue={searchValue}
      onSearchInputChange={setSearchValue}
    />
  );
};

export default Dashboard;

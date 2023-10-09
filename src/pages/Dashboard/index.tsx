/** @jsxImportSource @emotion/react */
import { ButtonGroup, Link, NoticeWarning, Tag, TagGroup, TextField } from 'components';
import React, { InputHTMLAttributes, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';

import { useGetPools } from 'clients/api';
import { MarketTable } from 'containers/MarketTable';
import { useAuth } from 'context/AuthContext';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';

import { ConnectWalletBanner } from './ConnectWalletBanner';
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
  const { t, Trans } = useTranslation();
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

  return (
    <>
      <ConnectWalletBanner />

      <NoticeWarning
        css={styles.banner}
        description={
          <Trans
            i18nKey="dashboard.banner.busdForceLiquidations"
            components={{
              Link: (
                <Link href="https://snapshot.org/#/venus-xvs.eth/proposal/0xbac76472c9eed8e874b10244c6b5f8e9444dc31eb81458a672a552c93bcaf6b9" />
              ),
            }}
          />
        }
      />

      <div css={styles.header}>
        <TextField
          css={[styles.tabletSearchTextField, showXlDownCss]}
          isSmall
          value={searchValue}
          onChange={handleSearchInputChange}
          placeholder={t('dashboard.searchInput.placeholder')}
          leftIconSrc="magnifier"
          variant="secondary"
        />

        <ButtonGroup
          css={[styles.tabletButtonGroup, showXlDownCss]}
          fullWidth
          buttonLabels={[t('dashboard.supplyTabTitle'), t('dashboard.borrowTabTitle')]}
          activeButtonIndex={activeTabIndex}
          onButtonClick={setActiveTabIndex}
        />

        <div css={styles.headerBottomRow}>
          {pools.length > 0 && (
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
              placeholder={t('dashboard.searchInput.placeholder')}
              leftIconSrc="magnifier"
              variant="secondary"
            />
          </div>
        </div>
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

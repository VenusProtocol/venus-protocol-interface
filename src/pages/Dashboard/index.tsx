/** @jsxImportSource @emotion/react */
import { Announcement, ButtonGroup, TextField, Toggle } from 'components';
import config from 'config';
import React, { InputHTMLAttributes, useState } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';

import { useGetPools } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { MarketTable, MarketTableProps } from 'containers/MarketTable';
import { useAuth } from 'context/AuthContext';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';

import ConnectWalletBanner from './ConnectWalletBanner';
import HigherRiskTokensNotice from './HigherRiskTokensNotice';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useFormatPools from './useFormatPools';

interface DashboardUiProps {
  areHigherRiskPoolsDisplayed: boolean;
  onHigherRiskPoolsToggleChange: (newValue: boolean) => void;
  searchValue: string;
  onSearchInputChange: (newValue: string) => void;
  pools: Pool[];
  isFetchingPools?: boolean;
}

export const DashboardUi: React.FC<DashboardUiProps> = ({
  pools,
  isFetchingPools,
  areHigherRiskPoolsDisplayed,
  onHigherRiskPoolsToggleChange,
  searchValue,
  onSearchInputChange,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const showXlDownCss = useShowXlDownCss();
  const hideXlDownCss = useHideXlDownCss();

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchInputChange(changeEvent.currentTarget.value);

  const formattedPools = useFormatPools({
    pools,
    includeHigherRiskPools: areHigherRiskPoolsDisplayed,
    searchValue,
  });

  const supplyMarketTableProps: MarketTableProps = {
    pools: formattedPools,
    isFetching: isFetchingPools,
    marketType: 'supply',
    breakpoint: 'lg',
    columns: config.featureFlags.isolatedPools
      ? ['asset', 'supplyApyLtv', 'pool', 'riskRating', 'collateral']
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
    columns: config.featureFlags.isolatedPools
      ? ['asset', 'borrowApy', 'pool', 'riskRating', 'liquidity']
      : ['asset', 'borrowApy', 'userWalletBalance', 'liquidity'],
    initialOrder: {
      orderBy: 'borrowApy',
      orderDirection: 'desc',
    },
  };

  return (
    <>
      <ConnectWalletBanner />

      <Announcement token={TOKENS.trxold} />

      {config.featureFlags.isolatedPools && <HigherRiskTokensNotice />}

      <div css={styles.header}>
        <TextField
          css={[styles.tabletSearchTextField, showXlDownCss]}
          isSmall
          value={searchValue}
          onChange={handleSearchInputChange}
          placeholder={
            config.featureFlags.isolatedPools
              ? t('dashboard.searchInput.placeholderIsolatedPools')
              : t('dashboard.searchInput.placeholder')
          }
          leftIconSrc="magnifier"
        />

        <ButtonGroup
          css={[styles.tabletButtonGroup, showXlDownCss]}
          fullWidth
          buttonLabels={[t('dashboard.supplyTabTitle'), t('dashboard.borrowTabTitle')]}
          activeButtonIndex={activeTabIndex}
          onButtonClick={setActiveTabIndex}
        />

        <div css={styles.headerBottomRow}>
          {config.featureFlags.isolatedPools && (
            <ButtonGroup
              css={hideXlDownCss}
              buttonLabels={[t('dashboard.supplyTabTitle'), t('dashboard.borrowTabTitle')]}
              activeButtonIndex={activeTabIndex}
              onButtonClick={setActiveTabIndex}
            />
          )}

          <div css={styles.rightColumn}>
            {config.featureFlags.isolatedPools && (
              <Toggle
                tooltip={t('dashboard.riskyTokensToggleTooltip')}
                label={t('dashboard.riskyTokensToggleLabel')}
                isLight
                value={areHigherRiskPoolsDisplayed}
                onChange={event => onHigherRiskPoolsToggleChange(event.currentTarget.checked)}
              />
            )}

            <TextField
              css={[styles.desktopSearchTextField, hideXlDownCss]}
              isSmall
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder={
                config.featureFlags.isolatedPools
                  ? t('dashboard.searchInput.placeholderIsolatedPools')
                  : t('dashboard.searchInput.placeholder')
              }
              leftIconSrc="magnifier"
            />
          </div>
        </div>
      </div>

      {config.featureFlags.isolatedPools ? (
        <>
          {activeTabIndex === 0 ? (
            <MarketTable
              {...supplyMarketTableProps}
              key="dashboard-supply-market-table"
              testId={TEST_IDS.supplyMarketTable}
            />
          ) : (
            <MarketTable
              {...borrowMarketTableProps}
              key="dashboard-borrow-market-table"
              testId={TEST_IDS.borrowMarketTable}
            />
          )}
        </>
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
  const [areHigherRiskPoolsDisplayed, setAreHigherRiskTokensDisplayed] = useState(true);

  const { data: getPoolData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  return (
    <DashboardUi
      pools={getPoolData?.pools || []}
      isFetchingPools={isGetPoolsLoading}
      areHigherRiskPoolsDisplayed={areHigherRiskPoolsDisplayed}
      onHigherRiskPoolsToggleChange={setAreHigherRiskTokensDisplayed}
      searchValue={searchValue}
      onSearchInputChange={setSearchValue}
    />
  );
};

export default Dashboard;

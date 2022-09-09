/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { ButtonGroup, Select, TextField, Toggle } from 'components';
import React, { InputHTMLAttributes, useContext, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import { useGetUserMarketInfo } from 'clients/api';
import { MarketTable } from 'containers/MarketTable';
import { AuthContext } from 'context/AuthContext';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';

import HigherRiskTokensNotice from './HigherRiskTokensNotice';
import { useStyles } from './styles';

interface DashboardUiProps {
  userTotalBorrowLimitCents: BigNumber;
  areHigherRiskTokensDisplayed: boolean;
  onHigherRiskTokensToggleChange: (newValue: boolean) => void;
  searchValue: string;
  onSearchInputChange: (newValue: string) => void;
  assets: Asset[];
}

const DashboardUi: React.FC<DashboardUiProps> = ({
  assets,
  areHigherRiskTokensDisplayed,
  onHigherRiskTokensToggleChange,
  searchValue,
  onSearchInputChange,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const showXlDownCss = useShowXlDownCss();
  const hideXlDownCss = useHideXlDownCss();

  // TODO: add all options
  const mobileSelectOptions = [
    {
      value: 'riskLevel',
      label: 'Risk level',
    },
  ];

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchInputChange(changeEvent.currentTarget.value);

  return (
    <>
      <HigherRiskTokensNotice />

      <div css={styles.header}>
        <TextField
          css={[styles.tabletSearchTextField, showXlDownCss]}
          isSmall
          value={searchValue}
          onChange={handleSearchInputChange}
          placeholder={t('dashboard.searchInput.placeholder')}
          leftIconName="magnifier"
        />

        <ButtonGroup
          css={[styles.tabletButtonGroup, showXlDownCss]}
          fullWidth
          buttonLabels={[t('dashboard.supplyMarketTabTitle'), t('dashboard.borrowMarketTabTitle')]}
          activeButtonIndex={activeTabIndex}
          onButtonClick={setActiveTabIndex}
        />

        <div css={styles.headerBottomRow}>
          <Select
            css={[styles.mobileSelect, showXlDownCss]}
            label={t('dashboard.mobileSelect.label')}
            title={t('dashboard.mobileSelect.title')}
            // TODO: wire up
            value={mobileSelectOptions[0].value}
            onChange={console.log}
            options={mobileSelectOptions}
            ariaLabel={t('dashboard.mobileSelect.ariaLabelFor')}
          />

          <ButtonGroup
            css={hideXlDownCss}
            buttonLabels={[
              t('dashboard.supplyMarketTabTitle'),
              t('dashboard.borrowMarketTabTitle'),
            ]}
            activeButtonIndex={activeTabIndex}
            onButtonClick={setActiveTabIndex}
          />

          <div css={styles.rightColumn}>
            <Toggle
              tooltip={t('dashboard.riskyTokensToggleTooltip')}
              label={t('dashboard.riskyTokensToggleLabel')}
              isLight
              value={areHigherRiskTokensDisplayed}
              onChange={event => onHigherRiskTokensToggleChange(event.currentTarget.checked)}
            />

            <TextField
              css={[styles.desktopSearchTextField, hideXlDownCss]}
              isSmall
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder={t('dashboard.searchInput.placeholder')}
              leftIconName="magnifier"
            />
          </div>
        </div>
      </div>

      {activeTabIndex === 0 ? (
        // TODO: handle sorting on mobile
        <MarketTable
          assets={assets}
          marketType="supply"
          breakpoint="lg"
          columns={['asset', 'supplyApyLtv', 'market', 'riskLevel', 'collateral']}
          initialOrder={{
            orderBy: 'supplyApyLtv',
            orderDirection: 'desc',
          }}
        />
      ) : (
        // TODO: handle sorting on mobile
        <MarketTable
          assets={assets}
          marketType="borrow"
          breakpoint="lg"
          columns={['asset', 'borrowApy', 'market', 'riskLevel', 'liquidity']}
          initialOrder={{
            orderBy: 'borrowApy',
            orderDirection: 'desc',
          }}
        />
      )}
    </>
  );
};

const Dashboard: React.FC = () => {
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address || '';

  const [searchValue, setSearchValue] = useState('');
  const [areHigherRiskTokensDisplayed, setAreHigherRiskTokensDisplayed] = useState(false);

  // TODO: handle loading state (see VEN-591)
  const {
    data: { assets, userTotalBorrowLimitCents },
  } = useGetUserMarketInfo({
    accountAddress,
  });

  return (
    <DashboardUi
      assets={assets}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
      areHigherRiskTokensDisplayed={areHigherRiskTokensDisplayed}
      onHigherRiskTokensToggleChange={setAreHigherRiskTokensDisplayed}
      searchValue={searchValue}
      onSearchInputChange={setSearchValue}
    />
  );
};

export default Dashboard;

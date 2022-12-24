/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { ButtonGroup, TextField, Toggle } from 'components';
import React, { InputHTMLAttributes, useContext, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import { useGetMainAssets } from 'clients/api';
import { MarketTable } from 'containers/MarketTable';
import { AuthContext } from 'context/AuthContext';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';

import ConnectWalletBanner from './ConnectWalletBanner';
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

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchInputChange(changeEvent.currentTarget.value);

  return (
    <>
      <ConnectWalletBanner />

      <HigherRiskTokensNotice />

      <div css={styles.header}>
        <TextField
          css={[styles.tabletSearchTextField, showXlDownCss]}
          isSmall
          value={searchValue}
          onChange={handleSearchInputChange}
          placeholder={t('dashboard.searchInput.placeholder')}
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
          <ButtonGroup
            css={hideXlDownCss}
            buttonLabels={[t('dashboard.supplyTabTitle'), t('dashboard.borrowTabTitle')]}
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
              leftIconSrc="magnifier"
            />
          </div>
        </div>
      </div>

      {activeTabIndex === 0 ? (
        <MarketTable
          key="dashboard-supply-market-table"
          assets={assets}
          marketType="supply"
          breakpoint="lg"
          columns={['asset', 'supplyApyLtv', 'pool', 'riskRating', 'collateral']}
          initialOrder={{
            orderBy: 'supplyApyLtv',
            orderDirection: 'desc',
          }}
        />
      ) : (
        <MarketTable
          key="dashboard-borrow-market-table"
          assets={assets}
          marketType="borrow"
          breakpoint="lg"
          columns={['asset', 'borrowApy', 'pool', 'riskRating', 'liquidity']}
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
  } = useGetMainAssets({
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

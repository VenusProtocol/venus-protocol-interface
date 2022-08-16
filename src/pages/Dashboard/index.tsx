/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { ButtonGroup, Icon, TextField, Toggle, Tooltip } from 'components';
import React, { InputHTMLAttributes, useContext, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import { useGetUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

import HigherRiskTokensNotice from './HigherRiskTokensNotice';
import BorrowMarket from './Markets/BorrowMarket';
import SupplyMarket from './Markets/SupplyMarket';
import { useStyles } from './styles';

interface DashboardUiProps {
  accountAddress: string;
  userTotalBorrowLimitCents: BigNumber;
  areHigherRiskTokensDisplayed: boolean;
  onHigherRiskTokensToggleChange: (newValue: boolean) => void;
  searchValue: string;
  onSearchInputChange: (newValue: string) => void;
  assets: Asset[];
}

const DashboardUi: React.FC<DashboardUiProps> = ({
  accountAddress,
  assets,
  areHigherRiskTokensDisplayed,
  onHigherRiskTokensToggleChange,
  searchValue,
  onSearchInputChange,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchInputChange(changeEvent.currentTarget.value);

  return (
    <>
      <HigherRiskTokensNotice />

      <div css={styles.header}>
        <ButtonGroup
          buttonLabels={[t('dashboard.supplyMarketTabTitle'), t('dashboard.borrowMarketTabTitle')]}
          activeButtonIndex={activeTabIndex}
          onButtonClick={setActiveTabIndex}
        />

        <div css={styles.rightColumn}>
          <div css={styles.toggleContainer}>
            <Tooltip css={styles.tooltip} title={t('dashboard.riskyTokensToggleTooltip')}>
              <Icon css={styles.infoIcon} name="info" />
            </Tooltip>

            <Typography
              color="text.primary"
              variant="small1"
              component="span"
              css={styles.toggleLabel}
            >
              {t('dashboard.riskyTokensToggleLabel')}
            </Typography>

            <Toggle
              css={styles.toggle}
              isLight
              value={areHigherRiskTokensDisplayed}
              onChange={event => onHigherRiskTokensToggleChange(event.currentTarget.checked)}
            />
          </div>

          <TextField
            css={styles.searchTextField}
            isSmall
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder={t('dashboard.searchInput.placeholder')}
            leftIconName="magnifier"
          />
        </div>
      </div>

      {activeTabIndex === 0 ? (
        // TODO: get isXvsEnabled from context
        <SupplyMarket isXvsEnabled accountAddress={accountAddress} assets={assets} />
      ) : (
        // TODO: get isXvsEnabled from context
        <BorrowMarket isXvsEnabled assets={assets} />
      )}
    </>
  );
};

const Dashboard: React.FC = () => {
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address || '';

  const [searchValue, setSearchValue] = useState('');
  const [areHigherRiskTokensDisplayed, setAreHigherRiskTokensDisplayed] = useState(false);

  // TODO: handle loading state (see https://app.clickup.com/t/2d4rcee)
  const {
    data: { assets, userTotalBorrowLimitCents },
  } = useGetUserMarketInfo({
    accountAddress,
  });

  return (
    <DashboardUi
      accountAddress={accountAddress}
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

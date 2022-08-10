/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { ButtonGroup, Select, TextField, Toggle } from 'components';
import React, { InputHTMLAttributes, useContext, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import { useGetUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';

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

const DashboardUi: React.FC<DashboardUiProps> = ({ accountAddress, assets }) => (
  <>
    <HigherRiskTokensNotice />

    <Markets
      isXvsEnabled
      accountAddress={accountAddress}
      // TODO: refactor to pass just one assets prop
      supplyMarketAssets={assets}
      borrowMarketAssets={assets}
    />
  </>
);

const Dashboard: React.FC = () => {
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address || '';

  const [searchValue, setSearchValue] = useState('');
  const [areHigherRiskTokensDisplayed, setAreHigherRiskTokensDisplayed] = useState(false);

  // TODO: fetch isolated lending markets

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

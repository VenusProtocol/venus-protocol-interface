/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import React from 'react';
import { Asset } from 'types';

import { useGetUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

import HigherRiskTokensNotice from './HigherRiskTokensNotice';
import Markets from './Markets';

interface DashboardUiProps {
  accountAddress: string;
  userTotalBorrowLimitCents: BigNumber;
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
  const { account } = React.useContext(AuthContext);
  const accountAddress = account?.address || '';
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
    />
  );
};

export default Dashboard;

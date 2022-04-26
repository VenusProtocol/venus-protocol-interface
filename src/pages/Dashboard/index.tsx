/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { AuthContext } from 'context/AuthContext';
import { useUserMarketInfo } from 'clients/api';
import { Asset } from 'types';
import MyAccount from './MyAccount';
import { SupplyMarket, BorrowMarket } from './Markets';
import { useStyles } from './styles';

interface IDashboardUiProps {
  accountAddress: string;
  userTotalBorrowBalance: BigNumber;
  userTotalBorrowLimit: BigNumber;
  assets: Asset[];
}

const DashboardUi: React.FC<IDashboardUiProps> = ({
  accountAddress,
  assets,
  userTotalBorrowBalance,
  userTotalBorrowLimit,
}) => {
  const styles = useStyles();
  const [isXvsEnabled, setIsXvsEnabled] = React.useState(true);
  const { suppliedAssets, supplyMarketAssets, borrowingAssets, borrowMarketAssets } =
    useMemo(() => {
      const sortedAssets = assets.reduce(
        (acc, curr) => {
          if (curr.supplyBalance.isZero()) {
            acc.supplyMarketAssets.push(curr);
          } else {
            acc.suppliedAssets.push(curr);
          }

          if (curr.borrowBalance.isZero()) {
            acc.borrowMarketAssets.push(curr);
          } else {
            acc.borrowingAssets.push(curr);
          }
          return acc;
        },
        {
          suppliedAssets: [] as Asset[],
          supplyMarketAssets: [] as Asset[],
          borrowingAssets: [] as Asset[],
          borrowMarketAssets: [] as Asset[],
        },
      );
      return sortedAssets;
    }, [JSON.stringify(assets)]);
  return (
    <div>
      <MyAccount
        assets={assets}
        setIsXvsEnabled={setIsXvsEnabled}
        isXvsEnabled={isXvsEnabled}
        userTotalBorrowBalance={userTotalBorrowBalance}
        userTotalBorrowLimit={userTotalBorrowLimit}
      />
      <div css={styles.container}>
        <SupplyMarket
          isXvsEnabled={isXvsEnabled}
          suppliedAssets={suppliedAssets}
          supplyMarketAssets={supplyMarketAssets}
          accountAddress={accountAddress}
        />
        <BorrowMarket
          isXvsEnabled={isXvsEnabled}
          borrowingAssets={borrowingAssets}
          borrowMarketAssets={borrowMarketAssets}
          userTotalBorrowLimit={userTotalBorrowLimit}
        />
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const { assets, userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    accountAddress: account?.address || '',
  });

  return (
    <DashboardUi
      accountAddress={account?.address || ''}
      assets={assets}
      userTotalBorrowBalance={userTotalBorrowBalance}
      userTotalBorrowLimit={userTotalBorrowLimit}
    />
  );
};

export default Dashboard;

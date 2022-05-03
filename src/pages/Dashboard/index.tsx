/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { AuthContext } from 'context/AuthContext';
import { useUserMarketInfo } from 'clients/api';
import { Asset } from 'types';

import MyAccount from './MyAccount';
import MintRepayVai from './MintRepayVai';
import Markets from './Markets';
import { useStyles } from './styles';

interface IDashboardUiProps {
  accountAddress: string;
  userTotalBorrowLimit: BigNumber;
  userTotalBorrowBalance: BigNumber;
  userTotalSupplyBalance: BigNumber;
  assets: Asset[];
}

const DashboardUi: React.FC<IDashboardUiProps> = ({
  accountAddress,
  assets,
  userTotalBorrowLimit,
  userTotalBorrowBalance,
  userTotalSupplyBalance,
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
    <>
      <div css={styles.row}>
        <MyAccount
          assets={assets}
          setIsXvsEnabled={setIsXvsEnabled}
          isXvsEnabled={isXvsEnabled}
          css={styles.column}
          userTotalBorrowLimit={userTotalBorrowLimit}
          userTotalBorrowBalance={userTotalBorrowBalance}
          userTotalSupplyBalance={userTotalSupplyBalance}
        />

        <MintRepayVai css={styles.column} />
      </div>

      <Markets
        isXvsEnabled={isXvsEnabled}
        accountAddress={accountAddress}
        userTotalBorrowLimit={userTotalBorrowLimit}
        suppliedAssets={suppliedAssets}
        supplyMarketAssets={supplyMarketAssets}
        borrowingAssets={borrowingAssets}
        borrowMarketAssets={borrowMarketAssets}
      />
    </>
  );
};

const Dashboard: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const { assets, userTotalBorrowLimit, userTotalBorrowBalance, userTotalSupplyBalance } =
    useUserMarketInfo({
      accountAddress: account?.address || '',
    });

  return (
    <DashboardUi
      accountAddress={account?.address || ''}
      assets={assets}
      userTotalBorrowLimit={userTotalBorrowLimit}
      userTotalBorrowBalance={userTotalBorrowBalance}
      userTotalSupplyBalance={userTotalSupplyBalance}
    />
  );
};

export default Dashboard;

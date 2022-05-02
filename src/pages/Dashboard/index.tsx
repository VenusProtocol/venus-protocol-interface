/** @jsxImportSource @emotion/react */
import React, { useState, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { AuthContext } from 'context/AuthContext';
import { useUserMarketInfo } from 'clients/api';
import { Asset } from 'types';

import { useIsSmDown, useIsXlDown } from 'hooks/responsive';
import { Tabs } from 'components';
import { useTranslation } from 'translation';
import MyAccount from './MyAccount';
import MintRepayVai from './MintRepayVai';
import { SupplyMarket, BorrowMarket } from './Markets';
import { useStyles } from './styles';

interface IDashboardMarketsUiProps {
  isXvsEnabled: boolean;
  accountAddress: string;
  userTotalBorrowLimit: BigNumber;
  suppliedAssets: Asset[];
  supplyMarketAssets: Asset[];
  borrowingAssets: Asset[];
  borrowMarketAssets: Asset[];
}

const DashboardMarketsUi: React.FC<IDashboardMarketsUiProps> = ({
  isXvsEnabled,
  accountAddress,
  userTotalBorrowLimit,
  suppliedAssets,
  supplyMarketAssets,
  borrowingAssets,
  borrowMarketAssets,
}) => {
  const { t } = useTranslation();
  const isXlDown = useIsXlDown();
  const isSmDown = useIsSmDown();
  const styles = useStyles();

  const [activeTab, setActiveTab] = useState(0);

  if (isXlDown) {
    const tabsContent = [
      {
        name: t('markets.supplyMarketTableTitle'),
        title: t('dashboard.markets.tabSupply'),
        content: (
          <SupplyMarket
            css={[styles.item, styles.market]}
            isXvsEnabled={isXvsEnabled}
            suppliedAssets={suppliedAssets}
            supplyMarketAssets={supplyMarketAssets}
            accountAddress={accountAddress}
          />
        ),
      },
      {
        name: t('markets.borrowMarketTableTitle'),
        title: t('dashboard.markets.tabBorrow'),
        content: (
          <BorrowMarket
            css={[styles.item, styles.market]}
            isXvsEnabled={isXvsEnabled}
            borrowingAssets={borrowingAssets}
            borrowMarketAssets={borrowMarketAssets}
            userTotalBorrowLimit={userTotalBorrowLimit}
          />
        ),
      },
    ];
    const tabletTitle = isSmDown ? undefined : tabsContent[activeTab].name;
    return (
      <div css={styles.tabsWrapper}>
        {isSmDown && (
          <h4 css={[styles.tabsHeader, styles.tabsTitle]}>{t('dashboard.markets.title')}</h4>
        )}
        <Tabs
          css={styles.tabsHeader}
          componentTitle={tabletTitle}
          tabsContent={tabsContent}
          onTabChange={setActiveTab}
        />
      </div>
    );
  }

  return (
    <div css={styles.container}>
      <SupplyMarket
        css={[styles.item, styles.market]}
        isXvsEnabled={isXvsEnabled}
        suppliedAssets={suppliedAssets}
        supplyMarketAssets={supplyMarketAssets}
        accountAddress={accountAddress}
      />
      <BorrowMarket
        css={[styles.item, styles.market]}
        isXvsEnabled={isXvsEnabled}
        borrowingAssets={borrowingAssets}
        borrowMarketAssets={borrowMarketAssets}
        userTotalBorrowLimit={userTotalBorrowLimit}
      />
    </div>
  );
};

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
      <div css={styles.container}>
        <MyAccount
          assets={assets}
          setIsXvsEnabled={setIsXvsEnabled}
          isXvsEnabled={isXvsEnabled}
          css={styles.item}
          userTotalBorrowLimit={userTotalBorrowLimit}
          userTotalBorrowBalance={userTotalBorrowBalance}
          userTotalSupplyBalance={userTotalSupplyBalance}
        />
        <MintRepayVai css={styles.item} />
      </div>
      <DashboardMarketsUi
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

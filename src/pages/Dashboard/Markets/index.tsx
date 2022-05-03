/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Paper } from '@mui/material';
import { Asset } from 'types';

import { Tabs } from 'components';
import { useTranslation } from 'translation';
import SupplyMarket from './SupplyMarket';
import BorrowMarket from './BorrowMarket';
import { useStyles as useLocalStyles } from './styles';
import { useStyles as useSharedStyles } from '../styles';

export interface IMarketsProps {
  isXvsEnabled: boolean;
  accountAddress: string;
  userTotalBorrowLimit: BigNumber;
  suppliedAssets: Asset[];
  supplyMarketAssets: Asset[];
  borrowingAssets: Asset[];
  borrowMarketAssets: Asset[];
}

const Markets: React.FC<IMarketsProps> = ({
  isXvsEnabled,
  accountAddress,
  userTotalBorrowLimit,
  suppliedAssets,
  supplyMarketAssets,
  borrowingAssets,
  borrowMarketAssets,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();
  const styles = {
    ...sharedStyles,
    ...localStyles,
  };

  const [activeTab, setActiveTab] = useState(0);

  const tabsContent = [
    {
      name: t('markets.supplyMarketTableTitle'),
      title: t('dashboard.markets.tabSupply'),
      content: (
        <SupplyMarket
          css={styles.market}
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
          css={styles.market}
          isXvsEnabled={isXvsEnabled}
          borrowingAssets={borrowingAssets}
          borrowMarketAssets={borrowMarketAssets}
          userTotalBorrowLimit={userTotalBorrowLimit}
        />
      ),
    },
  ];

  return (
    <>
      {/* Desktop display */}
      <div css={[styles.row, styles.desktopViewContainer]}>
        <SupplyMarket
          css={styles.column}
          isXvsEnabled={isXvsEnabled}
          suppliedAssets={suppliedAssets}
          supplyMarketAssets={supplyMarketAssets}
          accountAddress={accountAddress}
        />

        <BorrowMarket
          css={styles.column}
          isXvsEnabled={isXvsEnabled}
          borrowingAssets={borrowingAssets}
          borrowMarketAssets={borrowMarketAssets}
          userTotalBorrowLimit={userTotalBorrowLimit}
        />
      </div>

      {/* Tablet view */}
      <Paper css={styles.tabletViewContainer}>
        <Tabs
          css={styles.tabsHeader}
          componentTitle={tabsContent[activeTab].name}
          tabsContent={tabsContent}
          onTabChange={setActiveTab}
        />
      </Paper>

      {/* Mobile display */}
      <Paper css={styles.mobileViewContainer}>
        <h4 css={[styles.tabsHeader, styles.tabsTitle]}>{t('dashboard.markets.title')}</h4>

        <Tabs css={styles.tabsHeader} tabsContent={tabsContent} onTabChange={setActiveTab} />
      </Paper>
    </>
  );
};

export default Markets;

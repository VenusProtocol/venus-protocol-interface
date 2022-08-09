/** @jsxImportSource @emotion/react */
import { Paper } from '@mui/material';
import { Tabs } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import { useStyles as useSharedStyles } from '../styles';
import BorrowMarket from './BorrowMarket';
import SupplyMarket from './SupplyMarket';
import { useStyles as useLocalStyles } from './styles';

export interface MarketsProps {
  isXvsEnabled: boolean;
  accountAddress: string;
  supplyMarketAssets: Asset[];
  borrowMarketAssets: Asset[];
}

const Markets: React.FC<MarketsProps> = ({
  isXvsEnabled,
  accountAddress,
  supplyMarketAssets,
  borrowMarketAssets,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();
  const styles = {
    ...sharedStyles,
    ...localStyles,
  };

  const tabsContent = [
    {
      title: t('dashboard.markets.tabSupply'),
      content: (
        <SupplyMarket
          css={styles.market}
          isXvsEnabled={isXvsEnabled}
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
          borrowMarketAssets={borrowMarketAssets}
        />
      ),
    },
  ];

  return (
    <Paper css={styles.desktopViewContainer}>
      <Tabs css={styles.tabsHeader} tabsContent={tabsContent} />
    </Paper>
  );
};

export default Markets;

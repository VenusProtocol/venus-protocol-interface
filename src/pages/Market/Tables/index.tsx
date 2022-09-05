/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { ButtonGroup } from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import { MarketTable, MarketTableProps } from 'containers/MarketTable';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';

import { useStyles } from './styles';

export interface TablesProps {
  assets: Asset[];
}

export const Tables: React.FC<TablesProps> = ({ assets }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const hideXlDownCss = useHideXlDownCss();
  const showXlDownCss = useShowXlDownCss();

  const marketTableProps: {
    supply: MarketTableProps;
    borrow: MarketTableProps;
  } = {
    supply: {
      assets,
      // TODO: get isXvsEnabled from context
      isXvsEnabled: true,
      marketType: 'supply',
      breakpoint: 'md',
      columns: ['asset', 'supplyApyLtv', 'walletBalance', 'collateral'],
      initialOrder: {
        orderBy: 'supplyApyLtv',
        orderDirection: 'desc',
      },
    },
    borrow: {
      assets,
      // TODO: get isXvsEnabled from context
      isXvsEnabled: true,
      marketType: 'borrow',
      breakpoint: 'md',
      columns: ['asset', 'borrowApy', 'walletBalance', 'liquidity'],
      initialOrder: {
        orderBy: 'borrowApy',
        orderDirection: 'desc',
      },
    },
  };

  return (
    <>
      {/* Desktop view */}
      <div css={[styles.desktopContainer, hideXlDownCss]}>
        <MarketTable {...marketTableProps.supply} title={t('market.tables.supplyTableTitle')} />
        <MarketTable {...marketTableProps.borrow} title={t('market.tables.borrowTableTitle')} />
      </div>

      {/* Tablet/Mobile view */}
      <Paper css={[styles.tabletContainer, showXlDownCss]}>
        <div css={styles.tabletHeader}>
          <Typography variant="h4" css={styles.tabletHeaderTitle}>
            {t('market.tables.tabletTitle')}
          </Typography>

          <ButtonGroup
            css={styles.tabletHeaderButtonGroup}
            buttonLabels={[
              t('market.tables.tabletSupplyMarketTabTitle'),
              t('market.tables.tabletBorrowMarketTabTitle'),
            ]}
            activeButtonIndex={activeTabIndex}
            onButtonClick={setActiveTabIndex}
          />
        </div>

        {activeTabIndex === 0 ? (
          <MarketTable {...marketTableProps.supply} css={styles.tabletMarketTable} />
        ) : (
          <MarketTable {...marketTableProps.borrow} css={styles.tabletMarketTable} />
        )}
      </Paper>
    </>
  );
};

export default Tables;

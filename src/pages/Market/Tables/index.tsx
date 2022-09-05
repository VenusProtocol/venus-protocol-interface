/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { ButtonGroup, Select, TableRowProps } from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import Path from 'constants/path';
import { MarketTable, MarketTableProps } from 'containers/MarketTable';
import { useHideXlDownCss, useShowMdDownCss, useShowXlDownCss } from 'hooks/responsive';

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
  const showMdDownCss = useShowMdDownCss();

  const getRowHref = (row: TableRowProps[]) =>
    Path.ASSET.replace(':marketId', 'FAKE_MARKET_ID') // TODO: wire up
      .replace(':vTokenId', `${row[0].value}`);

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
      getRowHref,
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
      getRowHref,
    },
  };

  // TODO: add all options
  const mobileSelectOptions = [
    {
      value: 'riskLevel',
      label: 'Risk level',
    },
  ];

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

          <Select
            css={[styles.mobileSelect, showMdDownCss]}
            label={t('market.tables.mobileSelect.label')}
            title={t('market.tables.mobileSelect.title')}
            // TODO: wire up
            value={mobileSelectOptions[0].value}
            onChange={console.log}
            options={mobileSelectOptions}
            ariaLabel={t('market.tables.mobileSelect.ariaLabelFor')}
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

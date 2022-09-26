/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { ButtonGroup, Select } from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import { MarketTable, MarketTableProps } from 'containers/MarketTable';
import {
  useHideMdDownCss,
  useHideXlDownCss,
  useShowMdDownCss,
  useShowXlDownCss,
} from 'hooks/responsive';

import TEST_IDS from '../testIds';
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
  const hideMdDownCss = useHideMdDownCss();
  const showMdDownCss = useShowMdDownCss();

  const marketTableProps: {
    supply: MarketTableProps;
    borrow: MarketTableProps;
  } = {
    supply: {
      assets,
      marketType: 'supply',
      breakpoint: 'md',
      columns: ['asset', 'supplyApyLtv', 'supplyBalance', 'collateral'],
      initialOrder: {
        orderBy: 'supplyBalance',
        orderDirection: 'desc',
      },
    },
    borrow: {
      assets,
      marketType: 'borrow',
      breakpoint: 'md',
      columns: ['asset', 'borrowApy', 'borrowBalance', 'percentOfLimit'],
      initialOrder: {
        orderBy: 'borrowBalance',
        orderDirection: 'desc',
      },
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
    <div data-testid={TEST_IDS.tables}>
      {/* Desktop view */}
      <div css={[styles.desktopContainer, hideXlDownCss]}>
        <MarketTable
          {...marketTableProps.supply}
          title={t('account.marketBreakdown.tables.supplyTableTitle')}
        />

        <MarketTable
          {...marketTableProps.borrow}
          title={t('account.marketBreakdown.tables.borrowTableTitle')}
        />
      </div>

      {/* Tablet/Mobile view */}
      <Paper css={[styles.tabletContainer, showXlDownCss]}>
        <div css={styles.tabletHeader}>
          <Typography variant="h4" css={[styles.tabletHeaderTitle, hideMdDownCss]}>
            {t('account.marketBreakdown.tables.tabletTitle')}
          </Typography>

          <ButtonGroup
            css={styles.tabletHeaderButtonGroup}
            buttonLabels={[
              t('account.marketBreakdown.tables.tabletsupplyTabTitle'),
              t('account.marketBreakdown.tables.tabletborrowTabTitle'),
            ]}
            activeButtonIndex={activeTabIndex}
            onButtonClick={setActiveTabIndex}
          />

          <Select
            css={[styles.mobileSelect, showMdDownCss]}
            label={t('account.marketBreakdown.tables.mobileSelect.label')}
            title={t('account.marketBreakdown.tables.mobileSelect.title')}
            // TODO: wire up
            value={mobileSelectOptions[0].value}
            onChange={console.log}
            options={mobileSelectOptions}
            ariaLabel={t('account.marketBreakdown.tables.mobileSelect.ariaLabelFor')}
          />
        </div>

        {activeTabIndex === 0 ? (
          <MarketTable {...marketTableProps.supply} css={styles.tabletMarketTable} />
        ) : (
          <MarketTable {...marketTableProps.borrow} css={styles.tabletMarketTable} />
        )}
      </Paper>
    </div>
  );
};

export default Tables;

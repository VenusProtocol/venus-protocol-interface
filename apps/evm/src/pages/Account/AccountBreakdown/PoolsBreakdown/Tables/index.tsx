/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Card } from 'components';
import { useMemo, useState } from 'react';

import { ButtonGroup } from 'components';
import { MarketTable, type MarketTableProps } from 'containers/MarketTable';
import { useHideMdDownCss, useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';

import TEST_IDS from '../testIds';
import { useStyles } from './styles';

export interface TablesProps {
  pool: Pool;
}

export const Tables: React.FC<TablesProps> = ({ pool }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const hideXlDownCss = useHideXlDownCss();
  const showXlDownCss = useShowXlDownCss();
  const hideMdDownCss = useHideMdDownCss();

  const marketTableProps: {
    supply: MarketTableProps;
    borrow: MarketTableProps;
  } = useMemo(
    () => ({
      supply: {
        pools: [
          {
            ...pool,
            assets: pool.assets.filter(
              asset => asset.userSupplyBalanceTokens.isGreaterThan(0) || asset.isCollateralOfUser,
            ),
          },
        ],
        marketType: 'supply',
        controls: false,
        breakpoint: 'md',
        columns: ['asset', 'supplyApy', 'userSupplyBalance', 'collateral'],
        initialOrder: {
          orderBy: 'userSupplyBalance',
          orderDirection: 'desc',
        },
      },
      borrow: {
        pools: [
          {
            ...pool,
            assets: pool.assets.filter(asset => asset.userBorrowBalanceTokens.isGreaterThan(0)),
          },
        ],
        marketType: 'borrow',
        controls: false,
        breakpoint: 'md',
        columns: ['asset', 'borrowApy', 'userBorrowBalance', 'userPercentOfLimit'],
        initialOrder: {
          orderBy: 'userBorrowBalance',
          orderDirection: 'desc',
        },
      },
    }),
    [pool],
  );

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
      <Card css={[styles.tabletContainer, showXlDownCss]}>
        <div css={styles.tabletHeader}>
          <Typography variant="h4" css={[styles.tabletHeaderTitle, hideMdDownCss]}>
            {t('account.marketBreakdown.tables.tabletTitle')}
          </Typography>

          <ButtonGroup
            css={styles.tabletHeaderButtonGroup}
            buttonLabels={[
              t('account.marketBreakdown.tables.tabletSupplyTabTitle'),
              t('account.marketBreakdown.tables.tabletBorrowTabTitle'),
            ]}
            activeButtonIndex={activeTabIndex}
            onButtonClick={setActiveTabIndex}
          />
        </div>

        {activeTabIndex === 0 ? (
          <MarketTable
            key="supply-market-table"
            {...marketTableProps.supply}
            css={styles.tabletMarketTable}
          />
        ) : (
          <MarketTable
            key="borrow-market-table"
            {...marketTableProps.borrow}
            css={styles.tabletMarketTable}
          />
        )}
      </Card>
    </div>
  );
};

export default Tables;

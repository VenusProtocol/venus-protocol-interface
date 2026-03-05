/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Card } from 'components';
import { useMemo, useState } from 'react';

import { ButtonGroup } from 'components';
import { MarketTable, type MarketTableProps } from 'containers/MarketTable';
import { useIsSmDown } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';

import { EModeHeader } from './EModeHeader';
import { IsolatedModeHeader } from './IsolatedModeHeader';
import { useStyles } from './styles';

export interface TablesProps {
  pool: Pool;
}

export const Tables: React.FC<TablesProps> = ({ pool }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const isMobile = useIsSmDown();

  const marketTableProps: {
    supply: MarketTableProps;
    borrow: MarketTableProps;
  } = useMemo(
    () => ({
      supply: {
        assets: pool.assets.filter(
          asset => asset.userSupplyBalanceTokens.isGreaterThan(0) || asset.isCollateralOfUser,
        ),
        poolName: pool.name,
        poolComptrollerContractAddress: pool.comptrollerAddress,
        userEModeGroup: pool.userEModeGroup,
        marketType: 'supply',
        controls: false,
        rowControl: false,
        breakpoint: 'sm',
        columns: ['asset', 'supplyApy', 'userSupplyBalance', 'collateral'],
        initialOrder: {
          orderBy: 'userSupplyBalance',
          orderDirection: 'desc',
        },
        variant: 'primary',
      },
      borrow: {
        assets: pool.assets.filter(asset => asset.userBorrowBalanceTokens.isGreaterThan(0)),
        poolName: pool.name,
        poolComptrollerContractAddress: pool.comptrollerAddress,
        userEModeGroup: pool.userEModeGroup,
        marketType: 'borrow',
        controls: false,
        rowControl: false,
        breakpoint: 'sm',
        columns: ['asset', 'borrowApy', 'userBorrowBalance', 'userBorrowLimitSharePercentage'],
        initialOrder: {
          orderBy: 'userBorrowBalance',
          orderDirection: 'desc',
        },
        variant: 'primary',
      },
    }),
    [pool],
  );

  return (
    <>
      {/* Desktop view */}
      {!isMobile ? (
        <div css={[styles.desktopContainer]}>
          <MarketTable
            {...marketTableProps.supply}
            title={t('account.marketBreakdown.tables.supplyTableTitle')}
          />

          <MarketTable
            {...marketTableProps.borrow}
            title={
              <div className="flex gap-x-2">
                {t('account.marketBreakdown.tables.borrowTableTitle')}

                {pool.userEModeGroup &&
                  (pool.userEModeGroup.isIsolated ? (
                    <IsolatedModeHeader
                      groupName={pool.userEModeGroup.name}
                      poolComptrollerContractAddress={pool.comptrollerAddress}
                    />
                  ) : (
                    <EModeHeader
                      eModeGroupName={pool.userEModeGroup.name}
                      poolComptrollerContractAddress={pool.comptrollerAddress}
                    />
                  ))}
              </div>
            }
          />
        </div>
      ) : (
        <Card css={[styles.tabletContainer]} className="border-0">
          <div css={styles.tabletHeader}>
            <div className="items-center gap-x-2">
              <Typography variant="h4" css={styles.tabletHeaderTitle}>
                {t('account.marketBreakdown.tables.tabletTitle')}
              </Typography>
            </div>

            <ButtonGroup
              buttonSize="sm"
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
              header={
                pool.userEModeGroup &&
                (pool.userEModeGroup.isIsolated ? (
                  <IsolatedModeHeader
                    groupName={pool.userEModeGroup.name}
                    poolComptrollerContractAddress={pool.comptrollerAddress}
                    className="max-sm:hidden"
                  />
                ) : (
                  <EModeHeader
                    eModeGroupName={pool.userEModeGroup.name}
                    poolComptrollerContractAddress={pool.comptrollerAddress}
                    className="max-sm:hidden"
                  />
                ))
              }
              {...marketTableProps.supply}
              css={styles.tabletMarketTable}
              className="border-0"
            />
          ) : (
            <MarketTable
              key="borrow-market-table"
              header={
                pool.userEModeGroup &&
                (pool.userEModeGroup.isIsolated ? (
                  <IsolatedModeHeader
                    groupName={pool.userEModeGroup.name}
                    poolComptrollerContractAddress={pool.comptrollerAddress}
                    className="max-sm:hidden"
                  />
                ) : (
                  <EModeHeader
                    eModeGroupName={pool.userEModeGroup.name}
                    poolComptrollerContractAddress={pool.comptrollerAddress}
                    className="max-sm:hidden"
                  />
                ))
              }
              {...marketTableProps.borrow}
              css={styles.tabletMarketTable}
              className="border-0"
            />
          )}
        </Card>
      )}
    </>
  );
};

export default Tables;

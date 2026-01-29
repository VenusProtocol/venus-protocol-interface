import { Typography } from '@mui/material';
import { Card } from 'components';
import { useMemo, useState } from 'react';

import { ButtonGroup } from 'components';
import { MarketTable, type MarketTableProps } from 'containers/MarketTable';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';

import { EModeHeader } from './EModeHeader';

export interface TabsProps {
  pool: Pool;
}

export const Tabs: React.FC<TabsProps> = ({ pool }) => {
  const { t } = useTranslation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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
        breakpoint: 'md',
        columns: ['asset', 'supplyApy', 'userSupplyBalance', 'collateral'],
        initialOrder: {
          orderBy: 'userSupplyBalance',
          orderDirection: 'desc',
        },
      },
      borrow: {
        assets: pool.assets.filter(asset => asset.userBorrowBalanceTokens.isGreaterThan(0)),
        poolName: pool.name,
        poolComptrollerContractAddress: pool.comptrollerAddress,
        userEModeGroup: pool.userEModeGroup,
        marketType: 'borrow',
        controls: false,
        breakpoint: 'md',
        columns: ['asset', 'borrowApy', 'userBorrowBalance', 'userBorrowLimitSharePercentage'],
        initialOrder: {
          orderBy: 'userBorrowBalance',
          orderDirection: 'desc',
        },
      },
    }),
    [pool],
  );

  return (
    <>
      {/* Desktop view */}
      <div className="hidden xl:grid xl:grid-cols-2 xl:gap-x-6">
        <MarketTable
          {...marketTableProps.supply}
          title={t('dashboard.marketBreakdown.tables.supplyTableTitle')}
        />

        <MarketTable
          {...marketTableProps.borrow}
          title={
            <div className="flex gap-x-2">
              {t('dashboard.marketBreakdown.tables.borrowTableTitle')}

              {pool.userEModeGroup && (
                <EModeHeader
                  eModeGroupName={pool.userEModeGroup.name}
                  poolComptrollerContractAddress={pool.comptrollerAddress}
                />
              )}
            </div>
          }
        />
      </div>

      {/* Tablet/Mobile view */}
      <Card className="p-0 md:px-0 md:py-4 xl:hidden">
        <div className="block mb-4 md:mb-3 md:flex md:items-center md:justify-between md:px-6">
          <div className="items-center gap-x-2 hidden md:flex">
            <Typography variant="h4" className="mb-4 md:mb-0">
              {t('dashboard.marketBreakdown.tables.tabletTitle')}
            </Typography>

            {pool.userEModeGroup && (
              <EModeHeader
                eModeGroupName={pool.userEModeGroup.name}
                poolComptrollerContractAddress={pool.comptrollerAddress}
              />
            )}
          </div>

          <ButtonGroup
            className="mb-4 md:mb-0"
            buttonClassName="px-5"
            buttonLabels={[
              t('dashboard.marketBreakdown.tables.tabletSupplyTabTitle'),
              t('dashboard.marketBreakdown.tables.tabletBorrowTabTitle'),
            ]}
            activeButtonIndex={activeTabIndex}
            onButtonClick={setActiveTabIndex}
          />
        </div>

        {activeTabIndex === 0 ? (
          <MarketTable
            key="supply-market-table"
            header={
              pool.userEModeGroup && (
                <EModeHeader
                  eModeGroupName={pool.userEModeGroup.name}
                  poolComptrollerContractAddress={pool.comptrollerAddress}
                  className="md:hidden"
                />
              )
            }
            {...marketTableProps.supply}
            className="p-0"
          />
        ) : (
          <MarketTable
            key="borrow-market-table"
            header={
              pool.userEModeGroup && (
                <EModeHeader
                  eModeGroupName={pool.userEModeGroup.name}
                  poolComptrollerContractAddress={pool.comptrollerAddress}
                  className="md:hidden"
                />
              )
            }
            {...marketTableProps.borrow}
            className="p-0"
          />
        )}
      </Card>
    </>
  );
};

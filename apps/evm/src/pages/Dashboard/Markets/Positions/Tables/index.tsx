import { ButtonGroup, Card } from 'components';
import { MarketTable, type MarketTableProps } from 'containers/MarketTable';
import { useIsSmDown } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { useMemo, useState } from 'react';
import type { Pool } from 'types';

import { EModeHeader } from './EModeHeader';
import { IsolatedModeHeader } from './IsolatedModeHeader';

export interface TablesProps {
  pool: Pool;
}

export const Tables: React.FC<TablesProps> = ({ pool }) => {
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
        <div className="flex flex-col gap-6 xl:grid xl:grid-cols-2">
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
        <Card className="border-0 bg-transparent p-0 md:px-0 md:py-4">
          <div className="mb-4 block p-0 md:mb-3 md:flex md:items-center md:justify-between md:px-6">
            <div className="items-center gap-x-2">
              <h3 className="mb-4 text-p2s md:mb-0">
                {t('account.marketBreakdown.tables.tabletTitle')}
              </h3>
            </div>

            <ButtonGroup
              buttonSize="sm"
              className="mb-4 md:mb-0"
              buttonClassName="flex-1 px-5 md:flex-none"
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
                    className="hidden sm:flex"
                  />
                ) : (
                  <EModeHeader
                    eModeGroupName={pool.userEModeGroup.name}
                    poolComptrollerContractAddress={pool.comptrollerAddress}
                    className="hidden sm:flex"
                  />
                ))
              }
              {...marketTableProps.supply}
              className="border-0 p-0"
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
                    className="hidden sm:flex"
                  />
                ) : (
                  <EModeHeader
                    eModeGroupName={pool.userEModeGroup.name}
                    poolComptrollerContractAddress={pool.comptrollerAddress}
                    className="hidden sm:flex"
                  />
                ))
              }
              {...marketTableProps.borrow}
              className="border-0 p-0"
            />
          )}
        </Card>
      )}
    </>
  );
};

export default Tables;

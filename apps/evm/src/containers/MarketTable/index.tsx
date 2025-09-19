/** @jsxImportSource @emotion/react */
import { cn } from '@venusprotocol/ui';
import { useMemo } from 'react';
import type { Address } from 'viem';

import { Card, Delimiter, Table, type TableProps } from 'components';
import { MarketTableControls } from 'components/MarketTableControls';
import { routes } from 'constants/routing';
import { SwitchChainNotice } from 'containers/SwitchChainNotice';
import { useBreakpointUp } from 'hooks/responsive';
import { useCollateral } from 'hooks/useCollateral';
import { useMarketTableControls } from 'hooks/useMarketTableControls';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { Asset, EModeGroup } from 'types';
import pauseIconSrc from './pause.svg';
import { useStyles } from './styles';
import type { ColumnKey, PoolAsset } from './types';
import useGenerateColumns from './useGenerateColumns';

export interface MarketTableProps
  extends Partial<
    Omit<TableProps<PoolAsset>, 'columns' | 'rowKeyIndex' | 'initialOrder' | 'getRowHref'>
  > {
  assets: Asset[];
  poolName: string;
  poolComptrollerContractAddress: Address;
  columns: ColumnKey[];
  poolUserEModeGroup?: EModeGroup;
  controls?: boolean;
  initialOrder?: {
    orderBy: ColumnKey;
    orderDirection: 'asc' | 'desc';
  };
  marketType?: 'supply' | 'borrow';
  className?: string;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  assets,
  poolName,
  poolComptrollerContractAddress,
  poolUserEModeGroup,
  marketType,
  columns: columnKeys,
  initialOrder,
  breakpoint,
  title,
  controls = true,
  isFetching,
  header,
  ...otherTableProps
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const { toggleCollateral } = useCollateral();

  // The fallback breakpoint is just to satisfy TS here, it is not actually used
  const _isBreakpointUp = useBreakpointUp(breakpoint || 'xxl');
  const isBreakpointUp = !!breakpoint && _isBreakpointUp;

  const {
    assets: formattedAssets,
    pausedAssetsExist,
    searchValue,
    showPausedAssets,
    ...marketTableControlsProps
  } = useMarketTableControls({
    assets,
  });

  const poolAssets: PoolAsset[] = formattedAssets.map(asset => ({
    ...asset,
    poolName,
    poolComptrollerContractAddress,
    poolUserEModeGroup,
  }));

  const handleCollateralChange = async (poolAssetToUpdate: PoolAsset) => {
    try {
      await toggleCollateral({
        asset: poolAssetToUpdate,
        poolName: poolAssetToUpdate.poolName,
        comptrollerAddress: poolAssetToUpdate.poolComptrollerContractAddress,
      });
    } catch (error) {
      handleError({ error });
    }
  };

  const columns = useGenerateColumns({
    columnKeys,
    collateralOnChange: handleCollateralChange,
  });

  const formattedInitialOrder = useMemo(() => {
    if (!initialOrder) {
      return undefined;
    }

    const orderByColumn = columns.find(column => column.key === initialOrder.orderBy);

    return (
      orderByColumn && {
        orderBy: orderByColumn,
        orderDirection: initialOrder.orderDirection,
      }
    );
  }, [columns, initialOrder]);

  const getRowHref = (row: PoolAsset) =>
    routes.market.path
      .replace(':poolComptrollerAddress', row.poolComptrollerContractAddress)
      .replace(':vTokenAddress', row.vToken.address);

  return (
    <Table
      getRowHref={getRowHref}
      columns={columns}
      data={poolAssets}
      css={styles.cardContentGrid}
      className={cn(isBreakpointUp && !title && 'pt-0 sm:pt-0')}
      title={title}
      rowKeyExtractor={row => `market-table-row-${marketType}-${row.vToken.address}`}
      initialOrder={formattedInitialOrder}
      header={
        (header || controls || columnKeys.includes('collateral')) && (
          <div className={cn('space-y-4')}>
            {(controls || header) && (
              <div className={cn('flow-root space-y-4', isBreakpointUp && 'space-y-0')}>
                {header}

                {controls && (
                  <div className={cn(isBreakpointUp && '-mx-6')}>
                    <MarketTableControls
                      className={cn(isBreakpointUp && 'sm:mb-0 px-6 py-4')}
                      searchValue={searchValue}
                      showPausedAssets={showPausedAssets}
                      {...marketTableControlsProps}
                    />

                    {isBreakpointUp && <Delimiter />}
                  </div>
                )}
              </div>
            )}

            {columnKeys.includes('collateral') && <SwitchChainNotice />}
          </div>
        )
      }
      placeholder={
        controls &&
        !isFetching &&
        !searchValue &&
        poolAssets.length === 0 &&
        pausedAssetsExist &&
        !showPausedAssets && (
          <Card
            className={cn(
              'flex flex-col items-center text-center py-16 sm:py-16',
              isBreakpointUp && 'pt-14 pb-10 sm:pt-14 sm:pb-10',
            )}
          >
            <img
              src={pauseIconSrc}
              alt={t('marketTable.pausedAssetsPlaceholder.imgAlt')}
              className="mb-4 w-10"
            />

            <h4 className="font-semibold mb-1">{t('marketTable.pausedAssetsPlaceholder.title')}</h4>

            <p className="text-sm text-grey">
              {t('marketTable.pausedAssetsPlaceholder.description')}
            </p>
          </Card>
        )
      }
      breakpoint={breakpoint}
      isFetching={isFetching}
      {...otherTableProps}
    />
  );
};

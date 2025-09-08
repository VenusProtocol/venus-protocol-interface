/** @jsxImportSource @emotion/react */
import { cn } from '@venusprotocol/ui';
import { type InputHTMLAttributes, useMemo, useState } from 'react';

import { Card, Delimiter, Table, type TableProps, TextField, Toggle } from 'components';
import { useCollateral } from 'hooks/useCollateral';
import { handleError } from 'libs/errors';
import type { Pool } from 'types';

import { routes } from 'constants/routing';
import { SwitchChainNotice } from 'containers/SwitchChainNotice';
import { useBreakpointUp } from 'hooks/responsive';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { isAssetPaused } from 'utilities';
import pauseIconSrc from './pause.svg';
import { useStyles } from './styles';
import type { ColumnKey, PoolAsset } from './types';
import useGenerateColumns from './useGenerateColumns';

export interface MarketTableProps
  extends Partial<
    Omit<TableProps<PoolAsset>, 'columns' | 'rowKeyIndex' | 'initialOrder' | 'getRowHref'>
  > {
  pools: Pool[];
  columns: ColumnKey[];
  controls?: boolean;
  initialOrder?: {
    orderBy: ColumnKey;
    orderDirection: 'asc' | 'desc';
  };
  marketType?: 'supply' | 'borrow';
  className?: string;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  pools,
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
  const { accountAddress } = useAccountAddress();

  const [searchValue, setSearchValue] = useState('');

  // The fallback breakpoint is just to satisfy TS here, it is not actually used
  const _isBreakpointUp = useBreakpointUp(breakpoint || 'xxl');
  const isBreakpointUp = !!breakpoint && _isBreakpointUp;

  const [userChainSettings, setUserChainSettings] = useUserChainSettings();

  const { showPausedAssets: _showPausedAssets, showUserAssetsOnly: _showUserAssetsOnly } =
    userChainSettings;

  let userHasAssets = false;
  let pausedAssetsExist = false;

  pools.forEach(pool =>
    pool.assets.forEach(asset => {
      const isUserAsset = asset.userWalletBalanceTokens.isGreaterThan(0);

      if (isUserAsset && !userHasAssets) {
        userHasAssets = true;
      }

      const isPaused = isAssetPaused({ disabledTokenActions: asset.disabledTokenActions });
      if (isPaused && !pausedAssetsExist) {
        pausedAssetsExist = true;
      }
    }),
  );

  const showUserAssetsOnly = _showUserAssetsOnly && userHasAssets;
  const showPausedAssets = _showPausedAssets && pausedAssetsExist;

  const poolAssets: PoolAsset[] = [];

  pools.forEach(pool =>
    pool.assets.forEach(asset => {
      const isUserAsset = asset.userWalletBalanceTokens.isGreaterThan(0);

      if (controls && !isUserAsset && showUserAssetsOnly) {
        return;
      }

      const isPaused = isAssetPaused({ disabledTokenActions: asset.disabledTokenActions });

      // Handle paused assets
      if (controls && isPaused && !showPausedAssets) {
        return;
      }

      // Handle search
      if (
        controls &&
        !!searchValue &&
        !asset.vToken.underlyingToken.symbol.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        return;
      }

      const poolAsset: PoolAsset = {
        ...asset,
        pool,
      };

      poolAssets.push(poolAsset);
    }),
  );

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    setSearchValue(changeEvent.currentTarget.value);

  const handleCollateralChange = async (poolAssetToUpdate: PoolAsset) => {
    try {
      await toggleCollateral({
        asset: poolAssetToUpdate,
        poolName: poolAssetToUpdate.pool.name,
        comptrollerAddress: poolAssetToUpdate.pool.comptrollerAddress,
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
      .replace(':poolComptrollerAddress', row.pool.comptrollerAddress)
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
                    <div
                      className={cn(
                        'space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between',
                        isBreakpointUp && 'sm:mb-0 px-6 py-4',
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        {pausedAssetsExist && (
                          <Toggle
                            onChange={() =>
                              setUserChainSettings({ showPausedAssets: !showPausedAssets })
                            }
                            value={showPausedAssets}
                            label={t('marketTable.pausedAssetsToggle.label')}
                          />
                        )}

                        {!!accountAddress && userHasAssets && (
                          <Toggle
                            onChange={() =>
                              setUserChainSettings({ showUserAssetsOnly: !showUserAssetsOnly })
                            }
                            value={showUserAssetsOnly}
                            label={t('marketTable.userAssetsOnlyToggle.label')}
                          />
                        )}
                      </div>

                      <TextField
                        className="lg:w-[300px]"
                        isSmall
                        value={searchValue}
                        onChange={handleSearchInputChange}
                        placeholder={t('marketTable.searchInput.placeholder')}
                        leftIconSrc="magnifier"
                        variant="secondary"
                      />
                    </div>

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

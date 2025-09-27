/** @jsxImportSource @emotion/react */
import { cn } from '@venusprotocol/ui';
import { type InputHTMLAttributes, useMemo } from 'react';
import type { Address } from 'viem';

import { Card, Delimiter, Table, type TableProps, TextField, Toggle } from 'components';
import { routes } from 'constants/routing';
import { SwitchChainNotice } from 'containers/SwitchChainNotice';
import { useBreakpointUp } from 'hooks/responsive';
import { useCollateral } from 'hooks/useCollateral';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import pauseIconSrc from './pause.svg';
import { useStyles } from './styles';
import type { ColumnKey } from './types';
import { useColumns } from './useColumns';
import { useControls } from './useControls';

export interface MarketTableProps
  extends Partial<
    Omit<TableProps<Asset>, 'columns' | 'rowKeyIndex' | 'initialOrder' | 'getRowHref'>
  > {
  assets: Asset[];
  poolName: string;
  poolComptrollerContractAddress: Address;
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
  assets,
  poolName,
  poolComptrollerContractAddress,
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
    assets: filteredAssets,
    pausedAssetsExist,
    userHasAssets,
    userHasEModeGroup,
    searchValue,
    onSearchValueChange,
    showPausedAssets,
    showUserAssetsOnly,
    showUserEModeAssetsOnly,
    setShowPausedAssets,
    setShowUserEModeAssetsOnly,
    setShowUserAssetsOnly,
  } = useControls({
    assets,
    applyUserSettings: controls,
  });

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchValueChange(changeEvent.currentTarget.value);

  const handleCollateralChange = async (asset: Asset) => {
    try {
      await toggleCollateral({
        asset,
        poolName,
        comptrollerAddress: poolComptrollerContractAddress,
      });
    } catch (error) {
      handleError({ error });
    }
  };

  const columns = useColumns({
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

  const getRowHref = (row: Asset) =>
    routes.market.path
      .replace(':poolComptrollerAddress', poolComptrollerContractAddress)
      .replace(':vTokenAddress', row.vToken.address);

  return (
    <Table
      getRowHref={getRowHref}
      columns={columns}
      data={filteredAssets}
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
                        'space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:space-x-4',
                        isBreakpointUp && 'sm:mb-0 px-6 py-4',
                      )}
                    >
                      <div className="flex items-center gap-x-4 flex-wrap gap-y-6">
                        {pausedAssetsExist && (
                          <Toggle
                            onChange={() => setShowPausedAssets(!showPausedAssets)}
                            value={showPausedAssets}
                            label={t('marketTable.pausedAssetsToggle.label')}
                          />
                        )}

                        {userHasAssets && (
                          <Toggle
                            onChange={() => setShowUserAssetsOnly(!showUserAssetsOnly)}
                            value={showUserAssetsOnly}
                            label={t('marketTable.userAssetsOnlyToggle.label')}
                          />
                        )}

                        {userHasEModeGroup && (
                          <Toggle
                            onChange={() => setShowUserEModeAssetsOnly(!showUserEModeAssetsOnly)}
                            value={showUserEModeAssetsOnly}
                            label={t('marketTable.userEModeAssetsOnlyToggle.label')}
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
        filteredAssets.length === 0 &&
        pausedAssetsExist &&
        !showUserEModeAssetsOnly &&
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

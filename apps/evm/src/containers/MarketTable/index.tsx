/** @jsxImportSource @emotion/react */
import { cn } from '@venusprotocol/ui';
import { useMemo, useState } from 'react';
import type { Address } from 'viem';

import { Card, Delimiter, Modal, Table, type TableProps } from 'components';
import { routes } from 'constants/routing';
import { Controls } from 'containers/Controls';
import { SwitchChainNotice } from 'containers/SwitchChainNotice';
import { useBreakpointUp } from 'hooks/responsive';
import { useCollateral } from 'hooks/useCollateral';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountChainId, useChainId } from 'libs/wallet';
// TODO: move OperationForm to containers once it is stable. There's ongoing work happening on it,
// so moving it now could generate conflicts
import { OperationForm } from 'pages/Market/OperationForm';
import type { Asset, EModeGroup } from 'types';
import pauseIconSrc from './pause.svg';
import { useStyles } from './styles';
import type { ColumnKey } from './types';
import { useColumns } from './useColumns';
import { useControls } from './useControls';

export * from './types';

export interface MarketTableProps
  extends Partial<
    Omit<TableProps<Asset>, 'columns' | 'rowKeyIndex' | 'initialOrder' | 'getRowHref'>
  > {
  assets: Asset[];
  poolName: string;
  poolComptrollerContractAddress: Address;
  columns: ColumnKey[];
  modalColumn?: boolean;
  userEModeGroup?: EModeGroup;
  controls?: boolean;
  rowControl?: boolean;
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
  userEModeGroup,
  initialOrder,
  breakpoint,
  title,
  modalColumn = true,
  controls = true,
  rowControl = true,
  isFetching,
  header,
  className,
  ...otherTableProps
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const [selectedAsset, setSelectedAsset] = useState<Asset>();
  const handleCloseMarketModal = () => setSelectedAsset(undefined);

  const { toggleCollateral } = useCollateral();

  // The fallback breakpoint is just to satisfy TS here, it is not actually used
  const _isBreakpointUp = useBreakpointUp(breakpoint || '2xl');
  const isBreakpointUp = !!breakpoint && _isBreakpointUp;

  const {
    assets: filteredAssets,
    pausedAssetsExist,
    searchValue,
    onSearchValueChange,
    showPausedAssets,
  } = useControls({
    assets,
    applyUserSettings: controls,
  });

  const { chainId: currentChainId } = useChainId();
  const { chainId: accountChainId } = useAccountChainId();
  const isOnWrongChain = accountChainId !== currentChainId;

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

  const handleRowControlClick = (e: React.MouseEvent<HTMLButtonElement>, row: Asset) => {
    e.preventDefault();
    setSelectedAsset(row);
  };

  const columns = useColumns({
    columnKeys,
    collateralOnChange: handleCollateralChange,
    userEModeGroup,
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
    <>
      <Table
        controls={controls}
        getRowHref={getRowHref}
        columns={columns}
        data={filteredAssets}
        css={styles.cardContentGrid}
        className={cn(
          isBreakpointUp && !title && 'pt-0 sm:pt-0',
          !isBreakpointUp && 'border-0',
          className,
        )}
        title={title}
        rowKeyExtractor={row => `market-table-row-${marketType}-${row.vToken.address}`}
        initialOrder={formattedInitialOrder}
        header={
          (header || controls || (columnKeys.includes('collateral') && isOnWrongChain)) && (
            <div className={cn('space-y-4', isBreakpointUp && 'pt-4')}>
              {(controls || header) && (
                <div className={cn('flow-root space-y-4', isBreakpointUp && 'space-y-0')}>
                  {header}

                  {controls && (
                    <div className={cn(isBreakpointUp && '-mx-4')}>
                      <div className={cn(isBreakpointUp && 'px-4 pb-4')}>
                        <Controls
                          searchValue={searchValue}
                          onSearchValueChange={onSearchValueChange}
                          searchInputPlaceholder={t('marketTable.search.placeholder')}
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
          !showPausedAssets && (
            <Card
              className={cn(
                'flex flex-col items-center text-center py-16 border-0 sm:py-16',
                isBreakpointUp && 'pt-14 pb-10 sm:pt-14 sm:pb-10',
              )}
            >
              <img
                src={pauseIconSrc}
                alt={t('marketTable.pausedAssetsPlaceholder.imgAlt')}
                className="mb-4 w-10"
              />

              <h4 className="font-semibold mb-1">
                {t('marketTable.pausedAssetsPlaceholder.title')}
              </h4>

              <p className="text-sm text-grey">
                {t('marketTable.pausedAssetsPlaceholder.description')}
              </p>
            </Card>
          )
        }
        breakpoint={breakpoint}
        isFetching={isFetching}
        rowControlOnClick={rowControl ? handleRowControlClick : undefined}
        {...otherTableProps}
      />

      {selectedAsset && (
        <Modal
          isOpen={!!selectedAsset}
          title={selectedAsset.vToken.underlyingToken.symbol}
          handleClose={handleCloseMarketModal}
        >
          <OperationForm
            vToken={selectedAsset.vToken}
            poolComptrollerAddress={poolComptrollerContractAddress}
          />
        </Modal>
      )}
    </>
  );
};

import { useCallback, useMemo } from 'react';

import { Table, type TableProps } from 'components';
import useCollateral from 'hooks/useCollateral';
import { displayMutationError } from 'libs/errors';
import type { Pool } from 'types';

import { routes } from 'constants/routing';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useNavigate } from 'hooks/useNavigate';
import { areAddressesEqual } from 'utilities';
import type { ColumnKey, PoolAsset } from './types';
import useGenerateColumns from './useGenerateColumns';

export interface MarketTableProps extends Partial<Omit<TableProps<PoolAsset>, 'columns'>> {
  pools: Pool[];
  columns: ColumnKey[];
  className?: string;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  pools,
  columns: columnKeys,
  initialState,
  onRowClick,
  ...otherTableProps
}) => {
  const { corePoolComptrollerContractAddress, stakedEthPoolComptrollerContractAddress } =
    useGetChainMetadata();
  const { toggleCollateral } = useCollateral();
  const { navigate } = useNavigate();

  const handleCollateralChange = async (poolAssetToUpdate: PoolAsset) => {
    try {
      await toggleCollateral({
        asset: poolAssetToUpdate,
        poolName: poolAssetToUpdate.pool.name,
        comptrollerAddress: poolAssetToUpdate.pool.comptrollerAddress,
      });
    } catch (error) {
      displayMutationError({ error });
    }
  };

  const poolAssets = useMemo(
    () =>
      pools.reduce((acc, pool) => {
        const newPoolAssets: PoolAsset[] = pool.assets.map(asset => ({
          ...asset,
          pool,
        }));

        return acc.concat(newPoolAssets);
      }, [] as PoolAsset[]),
    [pools],
  );

  const columns = useGenerateColumns({
    columnKeys,
    collateralOnChange: handleCollateralChange,
  });

  const getHref = useCallback(
    (poolAsset: PoolAsset) => {
      if (
        areAddressesEqual(poolAsset.pool.comptrollerAddress, corePoolComptrollerContractAddress)
      ) {
        return routes.corePoolMarket.path.replace(':vTokenAddress', poolAsset.vToken.address);
      }

      if (
        stakedEthPoolComptrollerContractAddress &&
        areAddressesEqual(
          poolAsset.pool.comptrollerAddress,
          stakedEthPoolComptrollerContractAddress,
        )
      ) {
        return routes.stakedEthPoolMarket.path.replace(':vTokenAddress', poolAsset.vToken.address);
      }

      return routes.isolatedPoolMarket.path
        .replace(':poolComptrollerAddress', poolAsset.pool.comptrollerAddress)
        .replace(':vTokenAddress', poolAsset.vToken.address);
    },
    [
      corePoolComptrollerContractAddress,
      stakedEthPoolComptrollerContractAddress,
      stakedEthPoolComptrollerContractAddress,
    ],
  );

  const formattedOnRowClick: TableProps<PoolAsset>['onRowClick'] = (e, row) => {
    const href = getHref(row.original);
    navigate(href);

    if (onRowClick) {
      onRowClick(e, row);
    }
  };

  return (
    <Table
      onRowClick={formattedOnRowClick}
      columns={columns}
      data={poolAssets}
      initialState={initialState}
      {...otherTableProps}
    />
  );
};

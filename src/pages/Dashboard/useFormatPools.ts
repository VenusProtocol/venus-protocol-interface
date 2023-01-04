import { useMemo } from 'react';
import { Asset, Pool } from 'types';

const isAssetInSearch = ({
  asset,
  pool,
  searchValue,
}: {
  asset: Asset;
  pool: Pool;
  searchValue: string;
}) => {
  const lowerCasedSearchValue = searchValue.toLowerCase();

  return (
    asset.vToken.underlyingToken.symbol.toLowerCase().includes(lowerCasedSearchValue) ||
    pool.name.toLowerCase().includes(lowerCasedSearchValue)
  );
};

const useFormatPools = ({
  pools,
  includeHigherRiskPools,
  searchValue,
}: {
  pools: Pool[];
  includeHigherRiskPools: boolean;
  searchValue: string;
}) => {
  const filteredPools = useMemo(
    () =>
      // Filter ou pools that don't have a minimal risk rating if switch is
      // turned off
      includeHigherRiskPools ? pools : pools.filter(pool => pool.riskRating === 'MINIMAL'),
    [pools, includeHigherRiskPools],
  );

  const formattedPools = useMemo(() => {
    if (!searchValue) {
      return filteredPools;
    }

    return filteredPools.map(pool => ({
      ...pool,
      assets: pool.assets.filter(asset =>
        isAssetInSearch({
          asset,
          pool,
          searchValue,
        }),
      ),
    }));
  }, [filteredPools, searchValue]);

  return formattedPools;
};

export default useFormatPools;

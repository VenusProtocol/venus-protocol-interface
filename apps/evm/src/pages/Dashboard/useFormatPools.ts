import { useMemo } from 'react';

import type { Asset, Pool } from 'types';
import { isAssetDeprecated } from 'utilities';

const isAssetIncluded = ({
  asset,
  shouldDisplayDeprecatedAssets,
  searchValue,
}: {
  asset: Asset;
  searchValue: string;
  shouldDisplayDeprecatedAssets: boolean;
}) => {
  // Handle deprecated assets
  if (
    !shouldDisplayDeprecatedAssets &&
    isAssetDeprecated({ disabledTokenActions: asset.disabledTokenActions })
  ) {
    return false;
  }

  // Handle search
  if (!searchValue) {
    return true;
  }

  const lowerCasedSearchValue = searchValue.toLowerCase();
  return asset.vToken.underlyingToken.symbol.toLowerCase().includes(lowerCasedSearchValue);
};

const useFormatPools = ({
  pools,
  searchValue,
  shouldDisplayDeprecatedAssets,
  selectedPoolIndex,
}: {
  pools: Pool[];
  searchValue: string;
  shouldDisplayDeprecatedAssets: boolean;
  selectedPoolIndex: number;
}) => {
  const formattedPools = useMemo(() => {
    const filteredPools = selectedPoolIndex < 0 ? pools : [pools[selectedPoolIndex]];

    return filteredPools.map(pool => ({
      ...pool,
      assets: pool.assets.filter(asset =>
        isAssetIncluded({
          asset,
          shouldDisplayDeprecatedAssets,
          searchValue,
        }),
      ),
    }));
  }, [pools, searchValue, selectedPoolIndex, shouldDisplayDeprecatedAssets]);

  return formattedPools;
};

export default useFormatPools;

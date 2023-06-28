import { useMemo } from 'react';
import { Asset, Pool } from 'types';

const isAssetInSearch = ({ asset, searchValue }: { asset: Asset; searchValue: string }) => {
  const lowerCasedSearchValue = searchValue.toLowerCase();
  return asset.vToken.underlyingToken.symbol.toLowerCase().includes(lowerCasedSearchValue);
};

const useFormatPools = ({
  pools,
  searchValue,
  selectedPoolIndex,
}: {
  pools: Pool[];
  searchValue: string;
  selectedPoolIndex: number;
}) => {
  const formattedPools = useMemo(() => {
    const filteredPools = selectedPoolIndex < 0 ? pools : [pools[selectedPoolIndex]];

    if (!searchValue) {
      return filteredPools;
    }

    return filteredPools.map(pool => ({
      ...pool,
      assets: pool.assets.filter(asset =>
        isAssetInSearch({
          asset,
          searchValue,
        }),
      ),
    }));
  }, [pools, searchValue, selectedPoolIndex]);

  return formattedPools;
};

export default useFormatPools;

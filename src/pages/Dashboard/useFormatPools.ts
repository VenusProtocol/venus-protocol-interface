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

const useFormatPools = ({ pools, searchValue }: { pools: Pool[]; searchValue: string }) => {
  const formattedPools = useMemo(() => {
    if (!searchValue) {
      return pools;
    }

    return pools.map(pool => ({
      ...pool,
      assets: pool.assets.filter(asset =>
        isAssetInSearch({
          asset,
          pool,
          searchValue,
        }),
      ),
    }));
  }, [pools, searchValue]);

  return formattedPools;
};

export default useFormatPools;

import { useMemo } from 'react';
import { Asset, VToken } from 'types';
import { areTokensEqual } from 'utilities';

import { useGetPools } from 'clients/api';

export interface UseGetAssetInput {
  vToken: VToken;
  accountAddress?: string;
}

export interface UseGetAssetOutput {
  isLoading: boolean;
  data?: {
    asset?: Asset;
  };
}

const useGetAsset = ({ vToken, accountAddress }: UseGetAssetInput): UseGetAssetOutput => {
  const { data: getPoolsData, isLoading } = useGetPools({
    accountAddress,
  });

  const asset = useMemo(() => {
    if (!getPoolsData?.pools) {
      return undefined;
    }

    let matchingAsset: Asset | undefined;

    for (let p = 0; p < getPoolsData.pools.length; p++) {
      const pool = getPoolsData.pools[p];

      matchingAsset = pool.assets.find(poolAsset => areTokensEqual(poolAsset.vToken, vToken));

      // Break loop if we find a matching asset
      if (matchingAsset) {
        break;
      }
    }

    return matchingAsset;
  }, [vToken, getPoolsData?.pools]);

  return {
    isLoading,
    data: getPoolsData?.pools && {
      asset,
    },
  };
};

export default useGetAsset;

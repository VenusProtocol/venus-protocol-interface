import { useGetPools } from 'clients/api/queries/useGetPools';
import type { Asset } from 'types';
import type { Address } from 'viem';

import { findAssetByVTokenAddress } from './findAssetByVTokenAddress';

export interface UseGetAssetInput {
  vTokenAddress?: Address;
  accountAddress?: Address;
}

export interface UseGetAssetOutput {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  data?: {
    asset?: Asset;
  };
}

export const useGetAsset = ({
  vTokenAddress,
  accountAddress,
}: UseGetAssetInput): UseGetAssetOutput => {
  const {
    data: getPoolsData,
    isLoading,
    isError,
    refetch,
  } = useGetPools(
    {
      accountAddress,
    },
    {
      enabled: !!vTokenAddress,
    },
  );

  const asset = findAssetByVTokenAddress({ pools: getPoolsData?.pools, vTokenAddress });

  return {
    isLoading,
    isError,
    refetch,
    data: getPoolsData?.pools && {
      asset,
    },
  };
};

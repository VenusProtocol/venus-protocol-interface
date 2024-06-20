import { useMemo } from 'react';

import { useGetApiPools, useGetIsolatedPools, useGetLegacyPool } from 'clients/api';
import type { Pool } from 'types';

export interface UseGetPoolsInput {
  accountAddress?: string;
}

export interface UseGetPoolsOutput {
  isLoading: boolean;
  data?: {
    pools: Pool[];
  };
}

const useGetPools = ({ accountAddress }: UseGetPoolsInput): UseGetPoolsOutput => {
  const { data: getApiPoolData, isLoading: isGetApiPoolDataLoading } = useGetApiPools();

  const { data: getLegacyPoolData, isLoading: isGetLegacyPoolDataLoading } = useGetLegacyPool(
    {
      accountAddress,
      apiPoolsData: getApiPoolData!,
    },
    {
      enabled: !isGetApiPoolDataLoading && !!getApiPoolData,
    },
  );

  const { data: getIsolatedPoolsData, isLoading: isGetIsolatedPoolsDataLoading } =
    useGetIsolatedPools(
      {
        accountAddress,
        apiPoolsData: getApiPoolData!,
      },
      {
        enabled: !isGetApiPoolDataLoading && !!getApiPoolData,
      },
    );

  const isLoading =
    isGetApiPoolDataLoading && isGetLegacyPoolDataLoading && isGetIsolatedPoolsDataLoading;

  const data = useMemo(() => {
    if (isLoading) {
      return undefined;
    }

    const pools = (getLegacyPoolData?.pool ? [getLegacyPoolData?.pool] : []).concat(
      getIsolatedPoolsData?.pools || [],
    );

    return {
      pools,
    };
  }, [getLegacyPoolData?.pool, getIsolatedPoolsData?.pools, isLoading]);

  return { isLoading, data };
};

export default useGetPools;

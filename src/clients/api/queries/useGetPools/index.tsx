import { useMemo } from 'react';
import { Pool } from 'types';

import { useGetIsolatedPools, useGetLegacyPool } from 'clients/api';

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
  const { data: getLegacyPoolData, isLoading: isGetLegacyPoolDataLoading } = useGetLegacyPool({
    accountAddress,
  });

  const { data: getIsolatedPoolsData, isLoading: isGetIsolatedPoolsDataLoading } =
    useGetIsolatedPools({
      accountAddress,
    });

  const isLoading = isGetLegacyPoolDataLoading || isGetIsolatedPoolsDataLoading;

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

import { useMemo } from 'react';
import { Pool } from 'types';

import { useGetIsolatedPools, useGetMainPool } from 'clients/api';

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
  const { data: getMainPoolData, isLoading: isGetMainPoolDataLoading } = useGetMainPool({
    accountAddress,
  });

  const { data: getIsolatedPoolsData, isLoading: isGetIsolatedPoolsDataLoading } =
    useGetIsolatedPools({
      accountAddress,
    });

  const isLoading = isGetMainPoolDataLoading || isGetIsolatedPoolsDataLoading;

  const data = useMemo(() => {
    if (isLoading) {
      return undefined;
    }

    const pools = (getMainPoolData?.pool ? [getMainPoolData?.pool] : []).concat(
      getIsolatedPoolsData?.pools || [],
    );

    return {
      pools,
    };
  }, [getMainPoolData?.pool, getIsolatedPoolsData?.pools]);

  return { isLoading, data };
};

export default useGetPools;

import { useMemo } from 'react';
import { Pool } from 'types';

import { useGetMainPool } from 'clients/api';

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

  const pools = useMemo(() => {
    const allPools: Pool[] = [];

    if (getMainPoolData?.pool) {
      allPools.push(getMainPoolData.pool);
    }

    // TODO: add support for isolated pools

    return allPools;
  }, [getMainPoolData?.pool]);

  const isLoading = isGetMainPoolDataLoading;

  return { isLoading, data: { pools } };
};

export default useGetPools;

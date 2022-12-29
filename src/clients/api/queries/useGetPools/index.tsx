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

  const data = useMemo(() => {
    if (!getMainPoolData?.pool) {
      return undefined;
    }

    // TODO: add support for isolated pools

    return {
      pools: [getMainPoolData.pool],
    };
  }, [getMainPoolData?.pool]);

  const isLoading = isGetMainPoolDataLoading;

  return { isLoading, data };
};

export default useGetPools;

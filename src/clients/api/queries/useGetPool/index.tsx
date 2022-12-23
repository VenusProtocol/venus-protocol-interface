import { useMemo } from 'react';
import { Pool } from 'types';

import { useGetPools } from 'clients/api';

export interface UseGetPoolInput {
  poolComptrollerAddress: string;
  accountAddress?: string;
}

export interface UseGetPoolOutput {
  isLoading: boolean;
  data?: {
    pool?: Pool;
  };
}

const useGetPool = ({
  poolComptrollerAddress,
  accountAddress,
}: UseGetPoolInput): UseGetPoolOutput => {
  const { data: getPoolsData, isLoading } = useGetPools({
    accountAddress,
  });

  const pool = useMemo(
    () =>
      getPoolsData?.pools &&
      getPoolsData.pools.find(
        currPool =>
          currPool.comptrollerAddress.toLowerCase() === poolComptrollerAddress.toLowerCase(),
      ),
    [poolComptrollerAddress, getPoolsData?.pools],
  );

  return {
    isLoading,
    data: getPoolsData?.pools && {
      pool,
    },
  };
};

export default useGetPool;

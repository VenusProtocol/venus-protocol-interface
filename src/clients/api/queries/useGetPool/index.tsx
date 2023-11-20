import { useMemo } from 'react';
import { Pool } from 'types';
import { areAddressesEqual } from 'utilities';

import { useGetPools } from 'clients/api';

export interface UseGetPoolInput {
  poolComptrollerAddress: string;
  accountAddress?: string;
}

export interface UseGetPoolOutput {
  isLoading: boolean;
  data?: {
    pool: Pool;
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
      getPoolsData.pools.find(currPool =>
        areAddressesEqual(currPool.comptrollerAddress, poolComptrollerAddress),
      ),
    [poolComptrollerAddress, getPoolsData?.pools],
  );

  return {
    isLoading,
    data: pool && {
      pool,
    },
  };
};

export default useGetPool;

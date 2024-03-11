import { useMemo } from 'react';

import { useGetPools } from 'clients/api';
import type { Pool } from 'types';
import { areAddressesEqual } from 'utilities';

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
      getPoolsData?.pools?.find(currPool =>
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

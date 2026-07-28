import { useMemo } from 'react';

import { useGetPools } from 'clients/api/queries/useGetPools';
import type { Pool } from 'types';
import { areAddressesEqual } from 'utilities';
import type { Address } from 'viem';
import type { UseGetPoolsQueryOptions } from '../useGetPools/useGetPoolsQuery';

export interface UseGetPoolInput {
  poolComptrollerAddress: Address;
  accountAddress?: Address;
}

export interface UseGetPoolOutput {
  isLoading: boolean;
  data?: {
    pool: Pool;
  };
}

export const useGetPool = (
  { poolComptrollerAddress, accountAddress }: UseGetPoolInput,
  options?: UseGetPoolsQueryOptions,
): UseGetPoolOutput => {
  const { data: getPoolsData, isLoading } = useGetPools(
    {
      accountAddress,
    },
    options,
  );

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

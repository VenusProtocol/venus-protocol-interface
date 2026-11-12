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
  isLoadingError: boolean;
  refetch: () => unknown;
  data?: {
    pool: Pool;
  };
}

export const useGetPool = (
  { poolComptrollerAddress, accountAddress }: UseGetPoolInput,
  options?: UseGetPoolsQueryOptions,
): UseGetPoolOutput => {
  const {
    data: getPoolsData,
    isLoading,
    isLoadingError,
    refetch,
  } = useGetPools(
    {
      accountAddress,
    },
    options,
  );

  const pool = getPoolsData?.pools?.find(currPool =>
    areAddressesEqual(currPool.comptrollerAddress, poolComptrollerAddress),
  );

  return {
    isLoading,
    isLoadingError,
    refetch,
    data: pool && {
      pool,
    },
  };
};

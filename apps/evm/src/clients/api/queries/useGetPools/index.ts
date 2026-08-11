import { useEffect, useMemo } from 'react';

import { useGetIpLocation } from 'clients/api/queries/useGetIpLocation';

import { useChain } from 'hooks/useChain';
import { logError } from 'libs/errors';
import { areAddressesEqual } from 'utilities';
import { applyCountryCodeToPools } from './applyCountryCodeToPools';
import type { GetPoolsOutput } from './types';
import {
  type TrimmedInput,
  type UseGetPoolsQueryOptions,
  useGetPoolsQuery,
} from './useGetPoolsQuery';

export interface UseGetPoolsInput extends TrimmedInput {
  includeIsolatedPools?: boolean;
}

export const useGetPools = (
  { includeIsolatedPools = false, ...input }: UseGetPoolsInput = {},
  options?: UseGetPoolsQueryOptions,
) => {
  const poolsQuery = useGetPoolsQuery(input, options);
  const { corePoolComptrollerContractAddress } = useChain();

  const { data: getIpLocationData, error: getIpLocationError } = useGetIpLocation({
    enabled: options?.enabled !== false,
  });

  useEffect(() => {
    if (getIpLocationError) {
      logError(getIpLocationError);
    }
  }, [getIpLocationError]);

  const data = useMemo<GetPoolsOutput | undefined>(() => {
    if (!poolsQuery.data) {
      return undefined;
    }

    const pools = includeIsolatedPools
      ? poolsQuery.data.pools
      : poolsQuery.data.pools.filter(pool =>
          areAddressesEqual(pool.comptrollerAddress, corePoolComptrollerContractAddress),
        );

    return {
      pools: applyCountryCodeToPools({
        countryCode: getIpLocationData?.countryCode,
        pools,
        tokenMetadataMapping: poolsQuery.data.tokenMetadataMapping,
      }),
    };
  }, [
    getIpLocationData?.countryCode,
    poolsQuery.data,
    includeIsolatedPools,
    corePoolComptrollerContractAddress,
  ]);

  return {
    ...poolsQuery,
    data,
  };
};

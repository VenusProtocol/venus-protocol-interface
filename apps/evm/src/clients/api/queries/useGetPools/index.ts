import { useEffect, useMemo } from 'react';

import { useGetIpLocation } from 'clients/api/queries/useGetIpLocation';

import { logError } from 'libs/errors';
import { applyCountryCodeToPools } from './applyCountryCodeToPools';
import type { GetPoolsOutput } from './types';
import {
  type TrimmedInput,
  type UseGetPoolsQueryOptions,
  useGetPoolsQuery,
} from './useGetPoolsQuery';

export const useGetPools = (input?: TrimmedInput, options?: UseGetPoolsQueryOptions) => {
  const poolsQuery = useGetPoolsQuery(input, options);

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

    return {
      pools: applyCountryCodeToPools({
        countryCode: getIpLocationData?.countryCode,
        pools: poolsQuery.data.pools,
        tokenMetadataMapping: poolsQuery.data.tokenMetadataMapping,
      }),
    };
  }, [getIpLocationData?.countryCode, poolsQuery.data]);

  return {
    ...poolsQuery,
    data,
  };
};

import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { type GetLatestAppVersionOutput, getLatestAppVersion } from '.';

const REFETCH_INTERVAL_MS = 1000 * 60 * 60; // One hour in milliseconds

type Options = QueryObserverOptions<
  GetLatestAppVersionOutput,
  Error,
  GetLatestAppVersionOutput,
  GetLatestAppVersionOutput,
  [FunctionKey.GET_LATEST_APP_VERSION]
>;

export const useGetLatestAppVersion = (options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_LATEST_APP_VERSION],
    queryFn: getLatestAppVersion,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: REFETCH_INTERVAL_MS,
    ...options,
  });

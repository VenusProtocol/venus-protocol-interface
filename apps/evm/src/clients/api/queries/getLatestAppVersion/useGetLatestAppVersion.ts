import { type QueryObserverOptions, useQuery } from 'react-query';

import {
  type GetLatestAppVersionOutput,
  getLatestAppVersion,
} from 'clients/api/queries/getLatestAppVersion';
import FunctionKey from 'constants/functionKey';

const REFETCH_INTERVAL_MS = 1000 * 60 * 60; // One hour in milliseconds

type Options = QueryObserverOptions<
  GetLatestAppVersionOutput,
  Error,
  GetLatestAppVersionOutput,
  GetLatestAppVersionOutput,
  FunctionKey.GET_LATEST_APP_VERSION
>;

const useGetLatestAppVersion = (options?: Options) =>
  useQuery(FunctionKey.GET_LATEST_APP_VERSION, getLatestAppVersion, {
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetLatestAppVersion;

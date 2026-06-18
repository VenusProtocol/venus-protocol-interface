import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { type GetIpLocationOutput, getIpLocation } from './getIpLocation';

export type UseGetIpLocationQueryKey = [FunctionKey.GET_IP_LOCATION];

type Options = QueryObserverOptions<
  GetIpLocationOutput,
  Error,
  GetIpLocationOutput,
  GetIpLocationOutput,
  UseGetIpLocationQueryKey
>;

export const useGetIpLocation = (options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_IP_LOCATION],
    queryFn: getIpLocation,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    ...options,
  });

import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { type GetIsAddressAuthorizedOutput, getIsAddressAuthorized } from '.';

export type UseGetIsAddressAuthorizedQueryKey = [
  FunctionKey.GET_IS_ADDRESS_AUTHORIZED,
  { accountAddress: string },
];

type Options = QueryObserverOptions<
  GetIsAddressAuthorizedOutput,
  Error,
  GetIsAddressAuthorizedOutput,
  GetIsAddressAuthorizedOutput,
  UseGetIsAddressAuthorizedQueryKey
>;

const ONE_HOUR_MS = 60 * 60 * 1000;

export const useGetIsAddressAuthorized = (accountAddress: string, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_IS_ADDRESS_AUTHORIZED, { accountAddress }],
    queryFn: () => getIsAddressAuthorized({ accountAddress }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: ONE_HOUR_MS,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    ...options,
  });

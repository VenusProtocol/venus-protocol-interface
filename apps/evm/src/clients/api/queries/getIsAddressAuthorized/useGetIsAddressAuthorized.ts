import { QueryObserverOptions, useQuery } from 'react-query';

import getIsAddressAuthorized, {
  GetIsAddressAuthorizedOutput,
} from 'clients/api/queries/getIsAddressAuthorized';
import FunctionKey from 'constants/functionKey';

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

const useGetIsAddressAuthorized = (accountAddress: string, options?: Options) =>
  useQuery(
    [FunctionKey.GET_IS_ADDRESS_AUTHORIZED, { accountAddress }],
    () => getIsAddressAuthorized({ accountAddress }),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: ONE_HOUR_MS,
      staleTime: Number.POSITIVE_INFINITY,
      cacheTime: Number.POSITIVE_INFINITY,
      ...options,
    },
  );

export default useGetIsAddressAuthorized;

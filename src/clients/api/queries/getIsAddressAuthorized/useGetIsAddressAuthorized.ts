import { QueryObserverOptions, useQuery } from 'react-query';

import getIsAddressAuthorized, {
  GetIsAddressAuthorizedOutput,
} from 'clients/api/queries/getIsAddressAuthorized';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetIsAddressAuthorizedOutput,
  Error,
  GetIsAddressAuthorizedOutput,
  GetIsAddressAuthorizedOutput,
  FunctionKey.GET_IS_ADDRESS_AUTHORIZED
>;

const ONE_HOUR_MS = 60 * 60 * 1000;

const useGetIsAddressAuthorized = (accountAddress: string, options?: Options) =>
  useQuery(
    FunctionKey.GET_IS_ADDRESS_AUTHORIZED,
    () => getIsAddressAuthorized({ accountAddress }),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: ONE_HOUR_MS,
      ...options,
    },
  );

export default useGetIsAddressAuthorized;

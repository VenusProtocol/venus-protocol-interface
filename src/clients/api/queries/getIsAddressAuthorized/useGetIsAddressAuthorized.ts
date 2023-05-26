import { QueryObserverOptions, useQuery } from 'react-query';

import getIsAddressAuthorized, {
  GetIsAddressAuthorizedOutput,
} from 'clients/api/queries/getIsAddressAuthorized';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetIsAddressAuthorizedOutput,
  Error,
  GetIsAddressAuthorizedOutput,
  GetIsAddressAuthorizedOutput,
  FunctionKey.GET_IS_ADDRESS_AUTHORIZED
>;

const useGetIsAddressAuthorized = (accountAddress: string, options?: Options) =>
  useQuery(
    FunctionKey.GET_IS_ADDRESS_AUTHORIZED,
    () => getIsAddressAuthorized({ accountAddress }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );

export default useGetIsAddressAuthorized;

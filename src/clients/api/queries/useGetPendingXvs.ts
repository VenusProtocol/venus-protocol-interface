import { useQuery, QueryObserverOptions } from 'react-query';

import FunctionKey from 'constants/functionKey';
import { useVaiVaultContract } from 'clients/contracts/hooks';
import getPendingXVS, { GetPendingXvsOutput } from './getPendingXvs';

type Options = QueryObserverOptions<
  GetPendingXvsOutput,
  Error,
  GetPendingXvsOutput,
  GetPendingXvsOutput,
  FunctionKey.GET_PENDING_XVS
>;

const useGetPendingXvs = (accountAddress: string, options?: Options) => {
  const vaiVaultContract = useVaiVaultContract();

  return useQuery(
    FunctionKey.GET_PENDING_XVS,
    () => getPendingXVS({ accountAddress, vaiVaultContract }),
    options,
  );
};

export default useGetPendingXvs;

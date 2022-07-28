import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetVaiVaultPendingXvsInput,
  GetVaiVaultPendingXvsOutput,
  getVaiVaultPendingXvs,
} from 'clients/api';
import { useVaiVaultContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVaiVaultPendingXvsOutput,
  Error,
  GetVaiVaultPendingXvsOutput,
  GetVaiVaultPendingXvsOutput,
  [FunctionKey.GET_VAI_VAULT_PENDING_XVS, string]
>;

const useGetVaiVaultPendingXvs = (
  { accountAddress }: Omit<GetVaiVaultPendingXvsInput, 'vaiVaultContract'>,
  options?: Options,
) => {
  const vaiVaultContract = useVaiVaultContract();

  return useQuery(
    [FunctionKey.GET_VAI_VAULT_PENDING_XVS, accountAddress],
    () => getVaiVaultPendingXvs({ vaiVaultContract, accountAddress }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetVaiVaultPendingXvs;

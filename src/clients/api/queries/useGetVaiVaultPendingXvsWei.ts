import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetVaiVaultPendingXvsWeiOutput,
  IGetVaiVaultPendingXvsWeiInput,
  getVaiVaultPendingXvsWei,
} from 'clients/api';
import { useVaiVaultContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVaiVaultPendingXvsWeiOutput,
  Error,
  GetVaiVaultPendingXvsWeiOutput,
  GetVaiVaultPendingXvsWeiOutput,
  [FunctionKey.GET_VAI_VAULT_PENDING_XVS_WEI, string]
>;

const useGetVaiVaultPendingXvsWei = (
  { accountAddress }: Omit<IGetVaiVaultPendingXvsWeiInput, 'vaiVaultContract'>,
  options?: Options,
) => {
  const vaiVaultContract = useVaiVaultContract();

  return useQuery(
    [FunctionKey.GET_VAI_VAULT_PENDING_XVS_WEI, accountAddress],
    () => getVaiVaultPendingXvsWei({ vaiVaultContract, accountAddress }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetVaiVaultPendingXvsWei;

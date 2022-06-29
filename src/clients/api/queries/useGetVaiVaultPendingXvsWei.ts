import { useQuery, QueryObserverOptions } from 'react-query';
import {
  getVaiVaultPendingXvsWei,
  IGetVaiVaultPendingXvsWeiInput,
  GetVaiVaultPendingXvsWeiOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVaiVaultContract } from 'clients/contracts/hooks';

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
    options,
  );
};

export default useGetVaiVaultPendingXvsWei;

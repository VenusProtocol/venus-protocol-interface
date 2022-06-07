import { useQuery, QueryObserverOptions } from 'react-query';
import getVaiVaultPendingXvs, {
  IGetVaiVaultPendingXvsInput,
  GetVaiVaultPendingXvsOutput,
} from 'clients/api/queries/getVaiVaultPendingXvs';
import FunctionKey from 'constants/functionKey';
import { useVaiVaultContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVaiVaultPendingXvsOutput,
  Error,
  GetVaiVaultPendingXvsOutput,
  GetVaiVaultPendingXvsOutput,
  [FunctionKey.GET_VAI_VAULT_PENDING_XVS, string]
>;

const useGetVaiVaultPendingXvs = (
  { accountAddress }: Omit<IGetVaiVaultPendingXvsInput, 'vaiVaultContract'>,
  options?: Options,
) => {
  const vaiVaultContract = useVaiVaultContract();

  return useQuery(
    [FunctionKey.GET_VAI_VAULT_PENDING_XVS, accountAddress],
    () => getVaiVaultPendingXvs({ vaiVaultContract, accountAddress }),
    options,
  );
};

export default useGetVaiVaultPendingXvs;

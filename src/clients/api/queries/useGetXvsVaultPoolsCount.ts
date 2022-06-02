import { useQuery, QueryObserverOptions } from 'react-query';
import getXvsVaultPoolsCount, {
  GetXvsVaultPoolsCountOutput,
} from 'clients/api/queries/getXvsVaultPoolsCount';
import FunctionKey from 'constants/functionKey';
import { useXvsVaultContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetXvsVaultPoolsCountOutput,
  Error,
  GetXvsVaultPoolsCountOutput,
  GetXvsVaultPoolsCountOutput,
  FunctionKey.GET_XVS_VAULT_POOL_LENGTH
>;

const useGetXvsVaultPoolsCount = (options?: Options) => {
  const xvsVaultContract = useXvsVaultContract();

  return useQuery(
    FunctionKey.GET_XVS_VAULT_POOL_LENGTH,
    () => getXvsVaultPoolsCount({ xvsVaultContract }),
    options,
  );
};

export default useGetXvsVaultPoolsCount;

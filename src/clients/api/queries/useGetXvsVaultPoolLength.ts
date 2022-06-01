import { useQuery, QueryObserverOptions } from 'react-query';
import getXvsVaultPoolLength, {
  GetXvsVaultPoolLengthOutput,
} from 'clients/api/queries/getXvsVaultPoolLength';
import FunctionKey from 'constants/functionKey';
import { useXvsVaultContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetXvsVaultPoolLengthOutput,
  Error,
  GetXvsVaultPoolLengthOutput,
  GetXvsVaultPoolLengthOutput,
  FunctionKey.GET_XVS_VAULT_POOL_LENGTH
>;

const useGetXvsVaultPoolLength = (options?: Options) => {
  const xvsVaultContract = useXvsVaultContract();

  return useQuery(
    FunctionKey.GET_XVS_VAULT_POOL_LENGTH,
    () => getXvsVaultPoolLength({ xvsVaultContract }),
    options,
  );
};

export default useGetXvsVaultPoolLength;

import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getXvsVaultPoolCount, {
  GetXvsVaultPoolCountOutput,
} from 'clients/api/queries/getXvsVaultPoolCount';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type Options = QueryObserverOptions<
  GetXvsVaultPoolCountOutput,
  Error,
  GetXvsVaultPoolCountOutput,
  GetXvsVaultPoolCountOutput,
  FunctionKey.GET_XVS_VAULT_POOLS_COUNT
>;

const useGetXvsVaultPoolCount = (options?: Options) => {
  const xvsVaultContract = useGetUniqueContract({
    name: 'xvsVault',
  });

  return useQuery(
    FunctionKey.GET_XVS_VAULT_POOLS_COUNT,
    () => callOrThrow({ xvsVaultContract }, getXvsVaultPoolCount),
    options,
  );
};

export default useGetXvsVaultPoolCount;

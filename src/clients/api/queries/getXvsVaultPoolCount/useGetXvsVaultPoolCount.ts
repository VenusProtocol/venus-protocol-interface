import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getXvsVaultPoolCount, {
  GetXvsVaultPoolCountOutput,
} from 'clients/api/queries/getXvsVaultPoolCount';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';
import useGetVenusToken from 'hooks/useGetVenusToken';

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

  const xvs = useGetVenusToken({
    symbol: 'XVS',
  });

  return useQuery(
    FunctionKey.GET_XVS_VAULT_POOLS_COUNT,
    () => callOrThrow({ xvsVaultContract, xvsTokenAddress: xvs?.address }, getXvsVaultPoolCount),
    options,
  );
};

export default useGetXvsVaultPoolCount;

import { useGetXvsVaultContract } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getXvsVaultPoolCount, {
  GetXvsVaultPoolCountOutput,
} from 'clients/api/queries/getXvsVaultPoolCount';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetXvsVaultPoolCountOutput,
  Error,
  GetXvsVaultPoolCountOutput,
  GetXvsVaultPoolCountOutput,
  FunctionKey.GET_XVS_VAULT_POOLS_COUNT
>;

const useGetXvsVaultPoolCount = (options?: Options) => {
  const xvsVaultContract = useGetXvsVaultContract();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery(
    FunctionKey.GET_XVS_VAULT_POOLS_COUNT,
    () => callOrThrow({ xvsVaultContract, xvsTokenAddress: xvs?.address }, getXvsVaultPoolCount),
    options,
  );
};

export default useGetXvsVaultPoolCount;

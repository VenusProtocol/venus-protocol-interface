import { useGetXvsVaultContract } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getXvsVaultPoolCount, {
  GetXvsVaultPoolCountOutput,
} from 'clients/api/queries/getXvsVaultPoolCount';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

export type UseGetXvsVaultPoolCountQueryKey = [
  FunctionKey.GET_XVS_VAULT_POOLS_COUNT,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetXvsVaultPoolCountOutput,
  Error,
  GetXvsVaultPoolCountOutput,
  GetXvsVaultPoolCountOutput,
  UseGetXvsVaultPoolCountQueryKey
>;

const useGetXvsVaultPoolCount = (options?: Options) => {
  const { chainId } = useAuth();
  const xvsVaultContract = useGetXvsVaultContract();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_POOLS_COUNT, { chainId }],
    () => callOrThrow({ xvsVaultContract, xvsTokenAddress: xvs?.address }, getXvsVaultPoolCount),
    options,
  );
};

export default useGetXvsVaultPoolCount;

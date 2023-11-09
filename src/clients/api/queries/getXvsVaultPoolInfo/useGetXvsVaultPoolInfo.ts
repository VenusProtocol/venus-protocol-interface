import { useGetXvsVaultContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getXvsVaultPoolInfo, {
  GetXvsVaultPoolInfoInput,
  GetXvsVaultPoolInfoOutput,
} from 'clients/api/queries/getXvsVaultPoolInfo';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedGetXvsVaultPoolInfoInput = Omit<GetXvsVaultPoolInfoInput, 'xvsVaultContract'>;

export type UseGetXvsVaultPoolInfoQueryKey = [
  FunctionKey.GET_XVS_VAULT_POOL_INFOS,
  TrimmedGetXvsVaultPoolInfoInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultPoolInfoOutput,
  Error,
  GetXvsVaultPoolInfoOutput,
  GetXvsVaultPoolInfoOutput,
  UseGetXvsVaultPoolInfoQueryKey
>;

const useGetXvsVaultPoolInfo = (input: TrimmedGetXvsVaultPoolInfoInput, options?: Options) => {
  const { chainId } = useAuth();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_POOL_INFOS, { ...input, chainId }],
    () => callOrThrow({ xvsVaultContract }, params => getXvsVaultPoolInfo({ ...params, ...input })),
    options,
  );
};

export default useGetXvsVaultPoolInfo;

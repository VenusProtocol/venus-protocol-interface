import { useGetXvsVaultContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getXvsVaultPoolInfo, {
  GetXvsVaultPoolInfoInput,
  GetXvsVaultPoolInfoOutput,
} from 'clients/api/queries/getXvsVaultPoolInfo';
import FunctionKey from 'constants/functionKey';

type TrimmedGetXvsVaultPoolInfoInput = Omit<GetXvsVaultPoolInfoInput, 'xvsVaultContract'>;
type Options = QueryObserverOptions<
  GetXvsVaultPoolInfoOutput,
  Error,
  GetXvsVaultPoolInfoOutput,
  GetXvsVaultPoolInfoOutput,
  [FunctionKey.GET_XVS_VAULT_POOL_INFOS, TrimmedGetXvsVaultPoolInfoInput]
>;

const useGetXvsVaultPoolInfo = (input: TrimmedGetXvsVaultPoolInfoInput, options?: Options) => {
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_POOL_INFOS, input],
    () => callOrThrow({ xvsVaultContract }, params => getXvsVaultPoolInfo({ ...params, ...input })),
    options,
  );
};

export default useGetXvsVaultPoolInfo;

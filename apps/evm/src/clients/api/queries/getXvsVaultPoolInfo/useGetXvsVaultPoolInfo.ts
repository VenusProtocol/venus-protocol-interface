import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import getXvsVaultPoolInfo, {
  type GetXvsVaultPoolInfoInput,
  type GetXvsVaultPoolInfoOutput,
} from 'clients/api/queries/getXvsVaultPoolInfo';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

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

const useGetXvsVaultPoolInfo = (
  input: TrimmedGetXvsVaultPoolInfoInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_POOL_INFOS, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ xvsVaultContract }, params => getXvsVaultPoolInfo({ ...params, ...input })),
    ...options,
  });
};

export default useGetXvsVaultPoolInfo;

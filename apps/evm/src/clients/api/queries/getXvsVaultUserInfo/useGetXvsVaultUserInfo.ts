import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import getXvsVaultUserInfo, {
  type GetXvsVaultUserInfoInput,
  type GetXvsVaultUserInfoOutput,
} from 'clients/api/queries/getXvsVaultUserInfo';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsVaultUserInfoInput = Omit<GetXvsVaultUserInfoInput, 'xvsVaultContract'>;

export type UseGetXvsVaultUserInfoQueryKey = [
  FunctionKey.GET_XVS_VAULT_USER_INFO,
  TrimmedGetXvsVaultUserInfoInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultUserInfoOutput,
  Error,
  GetXvsVaultUserInfoOutput,
  GetXvsVaultUserInfoOutput,
  UseGetXvsVaultUserInfoQueryKey
>;

const useGetXvsVaultUserInfo = (
  input: TrimmedGetXvsVaultUserInfoInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_USER_INFO, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ xvsVaultContract }, params => getXvsVaultUserInfo({ ...params, ...input })),
    ...options,
  });
};

export default useGetXvsVaultUserInfo;

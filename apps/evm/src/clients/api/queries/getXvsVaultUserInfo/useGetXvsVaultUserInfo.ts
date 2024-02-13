import { useGetXvsVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultUserInfo, {
  GetXvsVaultUserInfoInput,
  GetXvsVaultUserInfoOutput,
} from 'clients/api/queries/getXvsVaultUserInfo';
import FunctionKey from 'constants/functionKey';
import { ChainId } from 'types';
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

const useGetXvsVaultUserInfo = (input: TrimmedGetXvsVaultUserInfoInput, options?: Options) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_USER_INFO, { ...input, chainId }],
    () => callOrThrow({ xvsVaultContract }, params => getXvsVaultUserInfo({ ...params, ...input })),
    options,
  );
};

export default useGetXvsVaultUserInfo;

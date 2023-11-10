import { useGetXvsVaultContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getXvsVaultRewardPerBlock, {
  GetXvsVaultRewardPerBlockInput,
  GetXvsVaultRewardPerBlockOutput,
} from 'clients/api/queries/getXvsVaultRewardPerBlock';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedGetXvsVaultRewardPerBlockInput = Omit<
  GetXvsVaultRewardPerBlockInput,
  'xvsVaultContract'
>;

export type UseGetXvsVaultRewardPerBlockQueryKey = [
  FunctionKey.GET_XVS_VAULT_REWARD_PER_BLOCK,
  TrimmedGetXvsVaultRewardPerBlockInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultRewardPerBlockOutput,
  Error,
  GetXvsVaultRewardPerBlockOutput,
  GetXvsVaultRewardPerBlockOutput,
  UseGetXvsVaultRewardPerBlockQueryKey
>;

const useGetXvsVaultRewardPerBlock = (
  input: TrimmedGetXvsVaultRewardPerBlockInput,
  options?: Options,
) => {
  const { chainId } = useAuth();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_REWARD_PER_BLOCK, { ...input, chainId }],
    () =>
      callOrThrow({ xvsVaultContract }, params =>
        getXvsVaultRewardPerBlock({ ...params, ...input }),
      ),
    options,
  );
};

export default useGetXvsVaultRewardPerBlock;

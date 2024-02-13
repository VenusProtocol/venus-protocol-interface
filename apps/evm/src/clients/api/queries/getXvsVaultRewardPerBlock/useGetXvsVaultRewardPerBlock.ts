import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultRewardPerBlock, {
  GetXvsVaultRewardPerBlockInput,
  GetXvsVaultRewardPerBlockOutput,
} from 'clients/api/queries/getXvsVaultRewardPerBlock';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

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
  const { chainId } = useChainId();
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

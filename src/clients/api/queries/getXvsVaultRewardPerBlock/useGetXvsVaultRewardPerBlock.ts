import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getXvsVaultRewardPerBlock, {
  GetXvsVaultRewardPerBlockInput,
  GetXvsVaultRewardPerBlockOutput,
} from 'clients/api/queries/getXvsVaultRewardPerBlock';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type TrimmedGetXvsVaultRewardPerBlockInput = Omit<
  GetXvsVaultRewardPerBlockInput,
  'xvsVaultContract'
>;
type Options = QueryObserverOptions<
  GetXvsVaultRewardPerBlockOutput,
  Error,
  GetXvsVaultRewardPerBlockOutput,
  GetXvsVaultRewardPerBlockOutput,
  [FunctionKey.GET_XVS_VAULT_REWARD_PER_BLOCK, TrimmedGetXvsVaultRewardPerBlockInput]
>;

const useGetXvsVaultRewardPerBlock = (
  input: TrimmedGetXvsVaultRewardPerBlockInput,
  options?: Options,
) => {
  const xvsVaultContract = useGetUniqueContract({
    name: 'xvsVault',
  });

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_REWARD_PER_BLOCK, input],
    () =>
      callOrThrow({ xvsVaultContract }, params =>
        getXvsVaultRewardPerBlock({ ...params, ...input }),
      ),
    options,
  );
};

export default useGetXvsVaultRewardPerBlock;

import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultRewardPerBlock, {
  GetXvsVaultRewardPerBlockInput,
  GetXvsVaultRewardPerBlockOutput,
} from 'clients/api/queries/getXvsVaultRewardPerBlock';
import { useXvsVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetXvsVaultRewardPerBlockOutput,
  Error,
  GetXvsVaultRewardPerBlockOutput,
  GetXvsVaultRewardPerBlockOutput,
  [FunctionKey.GET_XVS_VAULT_REWARD_PER_BLOCK, string]
>;

const useGetXvsVaultRewardPerBlock = (
  { tokenAddress }: Omit<GetXvsVaultRewardPerBlockInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_REWARD_PER_BLOCK, tokenAddress],
    () => getXvsVaultRewardPerBlock({ tokenAddress, xvsVaultContract }),
    options,
  );
};

export default useGetXvsVaultRewardPerBlock;

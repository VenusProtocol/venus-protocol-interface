import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultRewardWeiPerBlock, {
  GetXvsVaultRewardWeiPerBlockInput,
  GetXvsVaultRewardWeiPerBlockOutput,
} from 'clients/api/queries/getXvsVaultRewardWeiPerBlock';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetXvsVaultRewardWeiPerBlockOutput,
  Error,
  GetXvsVaultRewardWeiPerBlockOutput,
  GetXvsVaultRewardWeiPerBlockOutput,
  [FunctionKey.GET_XVS_VAULT_REWARD_WEI_PER_BLOCK, string]
>;

const useGetXvsVaultRewardWeiPerBlock = (
  { tokenAddress }: Omit<GetXvsVaultRewardWeiPerBlockInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_REWARD_WEI_PER_BLOCK, tokenAddress],
    () => getXvsVaultRewardWeiPerBlock({ tokenAddress, xvsVaultContract }),
    options,
  );
};

export default useGetXvsVaultRewardWeiPerBlock;

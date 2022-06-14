import { useQuery, QueryObserverOptions } from 'react-query';
import getXvsVaultRewardWeiPerBlock, {
  IGetXvsVaultRewardWeiPerBlockInput,
  GetXvsVaultRewardWeiPerBlockOutput,
} from 'clients/api/queries/getXvsVaultRewardWeiPerBlock';
import FunctionKey from 'constants/functionKey';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetXvsVaultRewardWeiPerBlockOutput,
  Error,
  GetXvsVaultRewardWeiPerBlockOutput,
  GetXvsVaultRewardWeiPerBlockOutput,
  [FunctionKey.GET_XVS_VAULT_REWARD_WEI_PER_BLOCK, string]
>;

const useGetXvsVaultRewardWeiPerBlock = (
  { tokenAddress }: Omit<IGetXvsVaultRewardWeiPerBlockInput, 'xvsVaultContract'>,
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

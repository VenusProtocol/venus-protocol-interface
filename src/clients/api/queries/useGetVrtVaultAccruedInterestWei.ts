import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultRewardWeiPerBlock, {
  GetVrtVaultAccruedInterestWeiInput,
  GetVrtVaultAccruedInterestWeiOutput,
} from 'clients/api/queries/getVrtVaultAccruedInterestWei';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVrtVaultAccruedInterestWeiOutput,
  Error,
  GetVrtVaultAccruedInterestWeiOutput,
  GetVrtVaultAccruedInterestWeiOutput,
  [FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST_WEI, string]
>;

const useGetVrtVaultAccruedInterestWei = (
  { accountAddress }: Omit<GetVrtVaultAccruedInterestWeiInput, 'vrtVaultContract'>,
  options?: Options,
) => {
  const vrtVaultContract = useVrtVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST_WEI, accountAddress],
    () => getXvsVaultRewardWeiPerBlock({ accountAddress, vrtVaultContract }),
    {
      ...options,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );
};

export default useGetVrtVaultAccruedInterestWei;

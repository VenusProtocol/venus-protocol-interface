import { useQuery, QueryObserverOptions } from 'react-query';
import getXvsVaultRewardWeiPerBlock, {
  IGetVrtVaultAccruedInterestWeiInput,
  GetVrtVaultAccruedInterestWeiOutput,
} from 'clients/api/queries/getVrtVaultAccruedInterestWei';
import FunctionKey from 'constants/functionKey';
import { STANDARD_REFETCH_INTERVAL_MS } from 'constants/standardRefetchInterval';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVrtVaultAccruedInterestWeiOutput,
  Error,
  GetVrtVaultAccruedInterestWeiOutput,
  GetVrtVaultAccruedInterestWeiOutput,
  [FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST_WEI, string]
>;

const useGetVrtVaultAccruedInterestWei = (
  { accountAddress }: Omit<IGetVrtVaultAccruedInterestWeiInput, 'vrtVaultContract'>,
  options?: Options,
) => {
  const vrtVaultContract = useVrtVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST_WEI, accountAddress],
    () => getXvsVaultRewardWeiPerBlock({ accountAddress, vrtVaultContract }),
    {
      ...options,
      refetchInterval: STANDARD_REFETCH_INTERVAL_MS,
    },
  );
};

export default useGetVrtVaultAccruedInterestWei;

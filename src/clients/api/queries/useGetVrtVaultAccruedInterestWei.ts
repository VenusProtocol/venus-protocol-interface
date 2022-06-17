import { useQuery, QueryObserverOptions } from 'react-query';
import getXvsVaultRewardWeiPerBlock, {
  IGetVrtVaultAccruedInterestWeiInput,
  GetVrtVaultAccruedInterestWeiOutput,
} from 'clients/api/queries/getVrtVaultAccruedInterestWei';
import FunctionKey from 'constants/functionKey';
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
    options,
  );
};

export default useGetVrtVaultAccruedInterestWei;

import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultRewardWeiPerBlock, {
  GetVrtVaultAccruedInterestInput,
  GetVrtVaultAccruedInterestOutput,
} from 'clients/api/queries/getVrtVaultAccruedInterest';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVrtVaultAccruedInterestOutput,
  Error,
  GetVrtVaultAccruedInterestOutput,
  GetVrtVaultAccruedInterestOutput,
  [FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST, string]
>;

const useGetVrtVaultAccruedInterest = (
  { accountAddress }: Omit<GetVrtVaultAccruedInterestInput, 'vrtVaultContract'>,
  options?: Options,
) => {
  const vrtVaultContract = useVrtVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST, accountAddress],
    () => getXvsVaultRewardWeiPerBlock({ accountAddress, vrtVaultContract }),
    {
      ...options,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );
};

export default useGetVrtVaultAccruedInterest;

import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultLockedDeposits, {
  GetXvsVaultLockedDepositsInput,
  GetXvsVaultLockedDepositsOutput,
} from 'clients/api/queries/getXvsVaultLockedDeposits';
import { useXvsVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetXvsVaultLockedDepositsOutput,
  Error,
  GetXvsVaultLockedDepositsOutput,
  GetXvsVaultLockedDepositsOutput,
  [
    FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
    Omit<GetXvsVaultLockedDepositsInput, 'xvsVaultContract'>,
  ]
>;

const useGetXvsVaultLockedDeposits = (
  params: Omit<GetXvsVaultLockedDepositsInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS, params],
    () => getXvsVaultLockedDeposits({ xvsVaultContract, ...params }),
    options,
  );
};

export default useGetXvsVaultLockedDeposits;

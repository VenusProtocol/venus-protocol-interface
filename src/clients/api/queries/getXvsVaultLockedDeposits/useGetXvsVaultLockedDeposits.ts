import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getXvsVaultLockedDeposits, {
  GetXvsVaultLockedDepositsInput,
  GetXvsVaultLockedDepositsOutput,
} from 'clients/api/queries/getXvsVaultLockedDeposits';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type TrimmedGetXvsVaultLockedDepositsInput = Omit<
  GetXvsVaultLockedDepositsInput,
  'xvsVaultContract'
>;
type Options = QueryObserverOptions<
  GetXvsVaultLockedDepositsOutput,
  Error,
  GetXvsVaultLockedDepositsOutput,
  GetXvsVaultLockedDepositsOutput,
  [FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS, TrimmedGetXvsVaultLockedDepositsInput]
>;

const useGetXvsVaultLockedDeposits = (
  input: TrimmedGetXvsVaultLockedDepositsInput,
  options?: Options,
) => {
  const xvsVaultContract = useGetUniqueContract({
    name: 'xvsVault',
  });

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS, input],
    () =>
      callOrThrow({ xvsVaultContract }, params =>
        getXvsVaultLockedDeposits({ ...params, ...input }),
      ),
    options,
  );
};

export default useGetXvsVaultLockedDeposits;

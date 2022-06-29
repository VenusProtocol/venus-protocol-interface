import { useQuery, QueryObserverOptions } from 'react-query';
import getXvsVaultWithdrawalRequests, {
  GetXvsVaultWithdrawalRequestsInput,
  GetXvsVaultWithdrawalRequestsOutput,
} from 'clients/api/queries/getXvsVaultWithdrawalRequests';
import FunctionKey from 'constants/functionKey';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetXvsVaultWithdrawalRequestsOutput,
  Error,
  GetXvsVaultWithdrawalRequestsOutput,
  GetXvsVaultWithdrawalRequestsOutput,
  FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS
>;

const useGetXvsVaultWithdrawalRequests = (
  params: Omit<GetXvsVaultWithdrawalRequestsInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useQuery(
    FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
    () => getXvsVaultWithdrawalRequests({ xvsVaultContract, ...params }),
    options,
  );
};

export default useGetXvsVaultWithdrawalRequests;

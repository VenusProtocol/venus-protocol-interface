import { useQuery, QueryObserverOptions } from 'react-query';
import getXvsVaultTotalAllocationPoints, {
  IGetXvsVaultTotalAllocPointsInput,
  GetXvsVaultTotalAllocPointsOutput,
} from 'clients/api/queries/getXvsVaultTotalAllocationPoints';
import FunctionKey from 'constants/functionKey';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetXvsVaultTotalAllocPointsOutput,
  Error,
  GetXvsVaultTotalAllocPointsOutput,
  GetXvsVaultTotalAllocPointsOutput,
  [FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, string]
>;

const useGetXvsVaultTotalAllocationPoints = (
  { tokenAddress }: Omit<IGetXvsVaultTotalAllocPointsInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, tokenAddress],
    () => getXvsVaultTotalAllocationPoints({ tokenAddress, xvsVaultContract }),
    options,
  );
};

export default useGetXvsVaultTotalAllocationPoints;

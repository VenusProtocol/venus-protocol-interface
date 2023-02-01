import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultTotalAllocationPoints, {
  GetXvsVaultTotalAllocPointsInput,
  GetXvsVaultTotalAllocPointsOutput,
} from 'clients/api/queries/getXvsVaultTotalAllocationPoints';
import { useXvsVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetXvsVaultTotalAllocPointsOutput,
  Error,
  GetXvsVaultTotalAllocPointsOutput,
  GetXvsVaultTotalAllocPointsOutput,
  [FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, string]
>;

const useGetXvsVaultTotalAllocationPoints = (
  { tokenAddress }: Omit<GetXvsVaultTotalAllocPointsInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, tokenAddress],
    () => getXvsVaultTotalAllocationPoints({ tokenAddress, xvsVaultContract }),
    options,
  );
};

export default useGetXvsVaultTotalAllocationPoints;

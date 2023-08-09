import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getXvsVaultTotalAllocationPoints, {
  GetXvsVaultTotalAllocPointsInput,
  GetXvsVaultTotalAllocPointsOutput,
} from 'clients/api/queries/getXvsVaultTotalAllocationPoints';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedGetXvsVaultTotalAllocPointsInput = Omit<
  GetXvsVaultTotalAllocPointsInput,
  'xvsVaultContract'
>;
type Options = QueryObserverOptions<
  GetXvsVaultTotalAllocPointsOutput,
  Error,
  GetXvsVaultTotalAllocPointsOutput,
  GetXvsVaultTotalAllocPointsOutput,
  [FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, TrimmedGetXvsVaultTotalAllocPointsInput]
>;

const useGetXvsVaultTotalAllocationPoints = (
  input: TrimmedGetXvsVaultTotalAllocPointsInput,
  options?: Options,
) => {
  const xvsVaultContract = useGetUniqueContract({
    name: 'xvsVault',
  });

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, input],
    () =>
      callOrThrow({ xvsVaultContract }, params =>
        getXvsVaultTotalAllocationPoints({ ...params, ...input }),
      ),
    options,
  );
};

export default useGetXvsVaultTotalAllocationPoints;

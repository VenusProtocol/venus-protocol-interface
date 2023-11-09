import { useGetXvsVaultContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getXvsVaultTotalAllocationPoints, {
  GetXvsVaultTotalAllocPointsInput,
  GetXvsVaultTotalAllocPointsOutput,
} from 'clients/api/queries/getXvsVaultTotalAllocationPoints';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedGetXvsVaultTotalAllocPointsInput = Omit<
  GetXvsVaultTotalAllocPointsInput,
  'xvsVaultContract'
>;

export type UseGetXvsVaultTotalAllocationPointsQueryKey = [
  FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS,
  TrimmedGetXvsVaultTotalAllocPointsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultTotalAllocPointsOutput,
  Error,
  GetXvsVaultTotalAllocPointsOutput,
  GetXvsVaultTotalAllocPointsOutput,
  UseGetXvsVaultTotalAllocationPointsQueryKey
>;

const useGetXvsVaultTotalAllocationPoints = (
  input: TrimmedGetXvsVaultTotalAllocPointsInput,
  options?: Options,
) => {
  const { chainId } = useAuth();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, { ...input, chainId }],
    () =>
      callOrThrow({ xvsVaultContract }, params =>
        getXvsVaultTotalAllocationPoints({ ...params, ...input }),
      ),
    options,
  );
};

export default useGetXvsVaultTotalAllocationPoints;

import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import getXvsVaultTotalAllocationPoints, {
  type GetXvsVaultTotalAllocPointsInput,
  type GetXvsVaultTotalAllocPointsOutput,
} from 'clients/api/queries/getXvsVaultTotalAllocationPoints';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

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
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, { ...input, chainId }],

    queryFn: () =>
      callOrThrow({ xvsVaultContract }, params =>
        getXvsVaultTotalAllocationPoints({ ...params, ...input }),
      ),

    ...options,
  });
};

export default useGetXvsVaultTotalAllocationPoints;

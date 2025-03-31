import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { chainMetadata } from '@venusprotocol/chains';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { getGovernorBravoDelegateContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import { type GetProposalStateInput, type GetProposalStateOutput, getProposalState } from '.';

type TrimmedGetProposalStateInput = Omit<
  GetProposalStateInput,
  'publicClient' | 'governorBravoDelegateAddress'
>;

type Options = QueryObserverOptions<
  GetProposalStateOutput,
  Error,
  GetProposalStateOutput,
  GetProposalStateOutput,
  [FunctionKey.GET_PROPOSAL_STATE, TrimmedGetProposalStateInput]
>;

export const useGetProposalState = (
  input: TrimmedGetProposalStateInput,
  options?: Partial<Options>,
) => {
  const { blockTimeMs } = chainMetadata[governanceChain.id];
  const { publicClient } = usePublicClient({
    chainId: governanceChain.id,
  });
  const governorBravoDelegateAddress = getGovernorBravoDelegateContractAddress({
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_STATE, input],

    queryFn: () =>
      callOrThrow({ governorBravoDelegateAddress }, params =>
        getProposalState({
          ...input,
          ...params,
          publicClient,
        }),
      ),

    refetchInterval: blockTimeMs || DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });
};

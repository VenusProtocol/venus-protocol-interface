import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { chainMetadata } from '@venusprotocol/chains';
import getProposalState, {
  type GetProposalStateInput,
  type GetProposalStateOutput,
} from 'clients/api/queries/getProposalState';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { getGovernorBravoDelegateContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

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

const useGetProposalState = (input: TrimmedGetProposalStateInput, options?: Partial<Options>) => {
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
      callOrThrow({ publicClient, governorBravoDelegateAddress }, params =>
        getProposalState({
          ...input,
          ...params,
        }),
      ),

    refetchInterval: blockTimeMs || DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });
};

export default useGetProposalState;

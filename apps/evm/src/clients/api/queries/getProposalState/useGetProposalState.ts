import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { chains } from '@venusprotocol/chains';
import FunctionKey from 'constants/functionKey';
import { getContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { governanceChainId } from 'libs/wallet';
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

const { blockTimeMs: BSC_BLOCK_TIME_MS } = chains[governanceChainId];
const governorBravoDelegateAddress = getContractAddress({
  name: 'GovernorBravoDelegate',
  chainId: governanceChainId,
});

export const useGetProposalState = (
  input: TrimmedGetProposalStateInput,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient({
    chainId: governanceChainId,
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
    refetchInterval: BSC_BLOCK_TIME_MS,
    ...options,
  });
};

import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getContractAddress } from 'libs/contracts';
import { governanceChainId, usePublicClient } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import { type GetProposalMinQuorumVotesOutput, getProposalMinQuorumVotes } from '.';

type Options = QueryObserverOptions<
  GetProposalMinQuorumVotesOutput,
  Error,
  GetProposalMinQuorumVotesOutput,
  GetProposalMinQuorumVotesOutput,
  [FunctionKey.GET_PROPOSAL_MIN_QUORUM_VOTES]
>;

export const useGetProposalMinQuorumVotes = (options?: Partial<Options>) => {
  const { publicClient } = usePublicClient({
    chainId: governanceChainId,
  });
  const governorBravoDelegateContractAddress = getContractAddress({
    name: 'GovernorBravoDelegate',
    chainId: governanceChainId,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_MIN_QUORUM_VOTES],
    queryFn: () =>
      callOrThrow({ governorBravoDelegateContractAddress }, params =>
        getProposalMinQuorumVotes({ ...params, publicClient }),
      ),
    ...options,
  });
};

import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { type GetProposalMinQuorumVotesOutput, getProposalMinQuorumVotes } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type Options = QueryObserverOptions<
  GetProposalMinQuorumVotesOutput,
  Error,
  GetProposalMinQuorumVotesOutput,
  GetProposalMinQuorumVotesOutput,
  [FunctionKey.GET_PROPOSAL_MIN_QUORUM_VOTES]
>;

export const useGetProposalMinQuorumVotes = (options?: Partial<Options>) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_MIN_QUORUM_VOTES],
    queryFn: () => callOrThrow({ governorBravoDelegateContract }, getProposalMinQuorumVotes),
    ...options,
  });
};

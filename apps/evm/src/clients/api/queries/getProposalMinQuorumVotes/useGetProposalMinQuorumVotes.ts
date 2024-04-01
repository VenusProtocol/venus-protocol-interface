import { type QueryObserverOptions, useQuery } from 'react-query';

import { type GetProposalMinQuorumVotesOutput, getProposalMinQuorumVotes } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

export type UseGetProposalMinQuorumVotesQueryKey = FunctionKey.GET_PROPOSAL_MIN_QUORUM_VOTES;

type Options = QueryObserverOptions<
  GetProposalMinQuorumVotesOutput,
  Error,
  GetProposalMinQuorumVotesOutput,
  GetProposalMinQuorumVotesOutput,
  UseGetProposalMinQuorumVotesQueryKey
>;

export const useGetProposalMinQuorumVotes = (options?: Options) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    chainId: governanceChain.id,
  });

  return useQuery(
    FunctionKey.GET_PROPOSAL_MIN_QUORUM_VOTES,
    () => callOrThrow({ governorBravoDelegateContract }, getProposalMinQuorumVotes),
    options,
  );
};

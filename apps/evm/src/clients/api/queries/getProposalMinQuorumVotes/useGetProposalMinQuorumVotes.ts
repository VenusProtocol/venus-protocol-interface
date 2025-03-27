import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getGovernorBravoDelegateContractAddress } from 'libs/contracts';
import { governanceChain, usePublicClient } from 'libs/wallet';
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
    chainId: governanceChain.id,
  });
  const governorBravoDelegateContractAddress = getGovernorBravoDelegateContractAddress({
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_MIN_QUORUM_VOTES],
    queryFn: () =>
      callOrThrow({ publicClient, governorBravoDelegateContractAddress }, params =>
        getProposalMinQuorumVotes(params),
      ),
    ...options,
  });
};

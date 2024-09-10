import { useQueryClient } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import type { Proposal } from 'types';
import type { GetProposalsOutput } from '../../getProposals';

export const useGetCachedProposal = ({ proposalId }: { proposalId: number }) => {
  const queryClient = useQueryClient();
  const proposalQueryResults = queryClient.getQueriesData<GetProposalsOutput>({
    queryKey: [FunctionKey.GET_PROPOSALS],
  });

  let cachedProposal: Proposal | undefined;

  proposalQueryResults.forEach(([_queryKey, data]) =>
    (data?.proposals || []).forEach(proposal => {
      if (+proposal.proposalId === proposalId) {
        cachedProposal = proposal;
      }
    }),
  );

  return cachedProposal;
};

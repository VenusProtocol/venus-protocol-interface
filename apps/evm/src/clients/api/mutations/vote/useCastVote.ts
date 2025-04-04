import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

import castVote, { type CastVoteInput } from './castVote';

type TrimmedCastVoteInput = Omit<CastVoteInput, 'governorBravoDelegateContract'>;
type Options = UseSendTransactionOptions<TrimmedCastVoteInput>;

const useCastVote = (options?: Partial<Options>) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: (input: TrimmedCastVoteInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        castVote({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: async ({ input }) => {
      const { proposalId, voteType } = input;
      const accountAddress = await governorBravoDelegateContract?.signer.getAddress();

      captureAnalyticEvent('Vote cast', {
        proposalId,
        voteType: indexedVotingSupportNames[voteType],
      });

      // Invalidate query to fetch voters
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_VOTERS,
          {
            id: proposalId,
            filter: voteType,
          },
        ],
      });

      // Invalidate queries to fetch user vote
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_VOTE_RECEIPT,
          {
            proposalId,
            accountAddress,
          },
        ],
      });

      // Invalidate queries to fetch proposal
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_PROPOSALS] });
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_PROPOSAL,
          {
            id: input.proposalId,
          },
        ],
      });
    },
    options,
  });
};

export default useCastVote;

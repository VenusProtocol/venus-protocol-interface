import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

import castVote, { CastVoteInput } from './castVote';

type TrimmedCastVoteInput = Omit<CastVoteInput, 'governorBravoDelegateContract'>;
type Options = UseSendTransactionOptions<TrimmedCastVoteInput>;

const useCastVote = (options?: Options) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.CAST_VOTE,
    fn: (input: TrimmedCastVoteInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        castVote({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: async ({ input }) => {
      const { proposalId, voteType } = input;

      captureAnalyticEvent('Vote cast', {
        proposalId,
        voteType: indexedVotingSupportNames[voteType],
      });

      // Invalidate query to fetch voters
      queryClient.invalidateQueries([
        FunctionKey.GET_VOTERS,
        {
          id: proposalId,
          filter: voteType,
        },
      ]);

      // Invalidate query to fetch proposal list
      queryClient.invalidateQueries(FunctionKey.GET_PROPOSALS);
    },
    options,
  });
};

export default useCastVote;

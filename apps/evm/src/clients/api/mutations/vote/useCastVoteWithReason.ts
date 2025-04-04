import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

import castVoteWithReason, { type CastVoteWithReasonInput } from './castVoteWithReason';

type TrimmedCastVoteWithReasonInput = Omit<
  CastVoteWithReasonInput,
  'governorBravoDelegateContract'
>;
type Options = UseSendTransactionOptions<TrimmedCastVoteWithReasonInput>;

const useCastVoteWithReason = (options?: Partial<Options>) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: (input: TrimmedCastVoteWithReasonInput) =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        castVoteWithReason({
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
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_VOTERS,
          {
            id: proposalId,
            filter: voteType,
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

export default useCastVoteWithReason;

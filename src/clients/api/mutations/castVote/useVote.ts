import useCastVote from './useCastVote';
import { ICastVoteWithReasonInput } from './castVoteWithReason';
import useCastVoteWithReason from './useCastVoteWithReason';

export type UseVoteParams = Partial<ICastVoteWithReasonInput> &
  Omit<ICastVoteWithReasonInput, 'voteReason'>;

const useVote = ({ accountAddress }: { accountAddress: string }) => {
  const { mutateAsync: castVote, isLoading: isCastVoteLoading } = useCastVote({
    fromAccountAddress: accountAddress,
  });

  const { mutateAsync: castVoteWithReason, isLoading: isCastVoteWithReasonLoading } =
    useCastVoteWithReason({ fromAccountAddress: accountAddress });

  const isLoading = isCastVoteLoading || isCastVoteWithReasonLoading;

  const vote = async ({ proposalId, voteType, voteReason }: UseVoteParams) => {
    if (voteReason) {
      return castVoteWithReason({
        proposalId,
        voteType,
        voteReason,
      });
    }

    return castVote({
      proposalId,
      voteType,
    });
  };

  return {
    isLoading,
    vote,
  };
};

export default useVote;

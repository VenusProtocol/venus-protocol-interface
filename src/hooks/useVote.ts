import { CastVoteWithReasonInput, useCastVote, useCastVoteWithReason } from 'clients/api';

export type UseVoteParams = Partial<CastVoteWithReasonInput> &
  Omit<CastVoteWithReasonInput, 'voteReason'>;

const useVote = () => {
  const { mutateAsync: castVote, isLoading: isCastVoteLoading } = useCastVote();

  const { mutateAsync: castVoteWithReason, isLoading: isCastVoteWithReasonLoading } =
    useCastVoteWithReason();

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

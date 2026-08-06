import type { TFunction } from 'i18next';
import { VoteSupport } from 'types';

export interface GetVoteStatusLabelInput {
  userVoteSupport: VoteSupport | undefined;
  t: TFunction;
}

export const getVoteStatusLabel = ({ userVoteSupport, t }: GetVoteStatusLabelInput) => {
  switch (userVoteSupport) {
    case VoteSupport.For:
      return t('voteProposalUi.voteStatus.votedFor');
    case VoteSupport.Against:
      return t('voteProposalUi.voteStatus.votedAgainst');
    case VoteSupport.Abstain:
      return t('voteProposalUi.voteStatus.abstained');
    default:
      return t('voteProposalUi.voteStatus.notVoted');
  }
};

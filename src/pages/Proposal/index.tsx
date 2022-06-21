/** @jsxImportSource @emotion/react */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'translation';
import { useGetProposal } from 'clients/api';
import { Spinner } from 'components';
import { IProposal } from 'types';
import VoteSummary from './VoteSummary';
import ProposalSummary from './ProposalSummary';
import { Description } from './Description';
import { useStyles } from './styles';

interface ProposalUiProps {
  proposal: IProposal | undefined;
}

export const ProposalUi: React.FC<ProposalUiProps> = ({ proposal }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  if (!proposal) {
    return (
      <div css={[styles.root, styles.spinner]}>
        <Spinner />
      </div>
    );
  }
  const { abstainedVotesWei, againstVotesWei, forVotesWei, totalVotesWei } = proposal;

  return (
    <div css={styles.root}>
      <ProposalSummary css={styles.summary} proposal={proposal} />
      <div css={styles.votes}>
        <VoteSummary
          css={styles.vote}
          label={t('vote.for')}
          votedValueWei={forVotesWei}
          votedTotalWei={totalVotesWei}
          votesFrom={[]}
          onClick={() => {}}
          progressBarColor={styles.successColor}
        />
        <VoteSummary
          css={[styles.vote, styles.middleVote]}
          label={t('vote.against')}
          votedValueWei={againstVotesWei}
          votedTotalWei={totalVotesWei}
          votesFrom={[]}
          onClick={() => {}}
          progressBarColor={styles.againstColor}
        />
        <VoteSummary
          css={styles.vote}
          label={t('vote.abstain')}
          votedValueWei={abstainedVotesWei}
          votedTotalWei={totalVotesWei}
          votesFrom={[]}
          onClick={() => {}}
          progressBarColor={styles.abstainColor}
        />
      </div>

      <Description description={proposal.description} actions={proposal.actions} />

      {voteModalType !== undefined && (
        <VoteModal
          voteModalType={voteModalType}
          handleClose={() => setVoteModalType(undefined)}
          vote={async (voteReason?: string) =>
            vote({ proposalId: proposal.id, voteType: voteModalType, voteReason })
          }
          readableVoteWeight={readableVoteWeight}
          isVoteLoading={isVoteLoading}
        />
      )}
    </div>
  );
};

const Proposal = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { data: proposal } = useGetProposal({ id: id || '' }, { enabled: !!id });
  return <ProposalUi proposal={proposal} />;
};

export default Proposal;

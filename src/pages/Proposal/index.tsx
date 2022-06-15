/** @jsxImportSource @emotion/react */
import React from 'react';
import { BigNumber } from 'bignumber.js';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'translation';
import { useGetProposal, useGetVoters } from 'clients/api';
import { Spinner } from 'components';
import { IProposal, IVoter } from 'types';
import VoteSummary from './VoteSummary';
import ProposalSummary from './ProposalSummary';
import { Description } from './Description';
import { useStyles } from './styles';

interface ProposalUiProps {
  proposal: IProposal | undefined;
  forVoters: IVoter;
  againstVoters: IVoter;
  abstainVoters: IVoter;
}

export const ProposalUi: React.FC<ProposalUiProps> = ({
  proposal,
  forVoters,
  againstVoters,
  abstainVoters,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  if (!proposal) {
    return (
      <div css={[styles.root, styles.spinner]}>
        <Spinner />
      </div>
    );
  }

  return (
    <div css={styles.root}>
      <ProposalSummary css={styles.summary} proposal={proposal} />
      <div css={styles.votes}>
        <VoteSummary
          css={styles.vote}
          label={t('vote.for')}
          votedValueWei={forVoters.sumVotes.for}
          votedTotalWei={forVoters.sumVotes.total}
          voters={forVoters.result}
          onClick={() => {}}
          progressBarColor={styles.successColor}
        />
        <VoteSummary
          css={[styles.vote, styles.middleVote]}
          label={t('vote.against')}
          votedValueWei={againstVoters.sumVotes.against}
          votedTotalWei={againstVoters.sumVotes.total}
          voters={againstVoters.result}
          onClick={() => {}}
          progressBarColor={styles.againstColor}
        />
        <VoteSummary
          css={styles.vote}
          label={t('vote.abstain')}
          votedValueWei={abstainVoters.sumVotes.abstain}
          votedTotalWei={abstainVoters.sumVotes.total}
          voters={abstainVoters.result}
          onClick={() => {}}
          progressBarColor={styles.abstainColor}
        />
      </div>
      <Description descriptionMarkdown="TODO: pass description markdown prop here" />
    </div>
  );
};

const Proposal = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const defaultValue = {
    result: [],
    sumVotes: {
      for: new BigNumber(0),
      against: new BigNumber(0),
      abstain: new BigNumber(0),
      total: new BigNumber(0),
    },
  };
  const { data: proposal } = useGetProposal({ id: id || '' }, { enabled: !!id });
  const { data: againstVoters = defaultValue } = useGetVoters(
    { id: id || '', filter: 0 },
    { enabled: !!id },
  );
  const { data: forVoters = defaultValue } = useGetVoters(
    { id: id || '', filter: 1 },
    { enabled: !!id },
  );
  const { data: abstainVoters = defaultValue } = useGetVoters(
    { id: id || '', filter: 2 },
    { enabled: !!id },
  );
  return (
    <ProposalUi
      proposal={proposal}
      forVoters={forVoters}
      againstVoters={againstVoters}
      abstainVoters={abstainVoters}
    />
  );
};

export default Proposal;

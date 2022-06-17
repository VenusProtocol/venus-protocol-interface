/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'translation';
import proposals from '__mocks__/models/proposals';
import VoteSummary from './VoteSummary';
import ProposalSummary from './ProposalSummary';
import Description from './Description';
import { useStyles } from './styles';

export const Vote: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <div css={styles.root}>
      <ProposalSummary css={styles.summary} proposal={proposals[0]} />
      <div css={styles.votes}>
        <VoteSummary
          css={styles.vote}
          label={t('vote.for')}
          votedValueWei={new BigNumber('10000000000000')}
          votedTotalWei={new BigNumber('200000000000000')}
          votesFrom={[]}
          onClick={() => {}}
          progressBarColor={styles.successColor}
        />
        <VoteSummary
          css={[styles.vote, styles.middleVote]}
          label={t('vote.against')}
          votedValueWei={new BigNumber('1000000000000')}
          votedTotalWei={new BigNumber('2000000000000')}
          votesFrom={[]}
          onClick={() => {}}
          progressBarColor={styles.againstColor}
        />
        <VoteSummary
          css={styles.vote}
          label={t('vote.abstain')}
          votedValueWei={new BigNumber('10000000000000')}
          votedTotalWei={new BigNumber('20000000000000')}
          votesFrom={[]}
          onClick={() => {}}
          progressBarColor={styles.abstainColor}
        />
      </div>
      <Description />
    </div>
  );
};

export default Vote;

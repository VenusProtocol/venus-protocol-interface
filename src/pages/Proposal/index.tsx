/** @jsxImportSource @emotion/react */
import React from 'react';
import Votes from './Votes';
import ProposalSummary from './ProposalSummary';
import { Description } from './Description';
import { useStyles } from './styles';

export const Vote: React.FC = () => {
  const styles = useStyles();
  return (
    <div css={styles.root}>
      <ProposalSummary css={styles.summary} />
      <div css={styles.votes}>
        <Votes css={styles.vote} />
        <Votes css={[styles.votes, styles.middleVote]} />
        <Votes css={styles.vote} />
      </div>
      <Description descriptionMarkdown="TODO: pass description markdown prop here" />
    </div>
  );
};

export default Vote;

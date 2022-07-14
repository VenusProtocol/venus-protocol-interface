/** @jsxImportSource @emotion/react */
import React from 'react';

import Governance from './Governance';
import VotingWallet from './VotingWallet';
import { useStyles } from './styles';

export const Vote: React.FC = () => {
  const styles = useStyles();
  return (
    <div css={styles.root}>
      <Governance />
      <VotingWallet />
    </div>
  );
};

export default Vote;

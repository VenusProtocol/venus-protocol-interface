/** @jsxImportSource @emotion/react */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import useUrlPagination, { UseUrlPaginationOutput } from 'hooks/useUrlPagination';

import Governance from './Governance';
import VotingWallet from './VotingWallet';
import { useStyles } from './styles';

export type VotePageUiProps = UseUrlPaginationOutput;

export const VoteUi: React.FC<VotePageUiProps> = ({ currentPage, setCurrentPage }) => {
  const styles = useStyles();

  return (
    <div css={styles.root}>
      <Governance currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <VotingWallet />
    </div>
  );
};

export type VotePageProps = RouteComponentProps;

const Vote: React.FC<VotePageProps> = ({ history, location }) => {
  const useUrlPaginationProps = useUrlPagination({ history, location });

  return <VoteUi {...useUrlPaginationProps} />;
};

export default Vote;

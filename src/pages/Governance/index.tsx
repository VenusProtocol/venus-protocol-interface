/** @jsxImportSource @emotion/react */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import useUrlPagination, { UseUrlPaginationOutput } from 'hooks/useUrlPagination';

import ProposalList from './ProposalList';
import VotingWallet from './VotingWallet';
import { useStyles } from './styles';

export type GovernancePageUiProps = UseUrlPaginationOutput;

export const GovernanceUi: React.FC<GovernancePageUiProps> = ({ currentPage, setCurrentPage }) => {
  const styles = useStyles();

  return (
    <div css={styles.root}>
      <ProposalList currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <VotingWallet />
    </div>
  );
};

export type GovernancePageProps = RouteComponentProps;

const Governance: React.FC<GovernancePageProps> = ({ history, location }) => {
  const useUrlPaginationProps = useUrlPagination({ history, location });

  return <GovernanceUi {...useUrlPaginationProps} />;
};

export default Governance;

/** @jsxImportSource @emotion/react */
import * as React from 'react';

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

const Governance: React.FC = () => {
  const useUrlPaginationProps = useUrlPagination();

  return <GovernanceUi {...useUrlPaginationProps} />;
};

export default Governance;

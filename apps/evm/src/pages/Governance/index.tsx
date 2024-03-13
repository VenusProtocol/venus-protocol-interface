import { type UseUrlPaginationOutput, useUrlPagination } from 'hooks/useUrlPagination';

import ProposalList from './ProposalList';
import VotingWallet from './VotingWallet';

export type GovernancePageUiProps = UseUrlPaginationOutput;

export const GovernanceUi: React.FC<GovernancePageUiProps> = ({ currentPage, setCurrentPage }) => (
  <div className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-[2fr,1fr] sm:gap-x-8">
    <VotingWallet className="sm:order-2" />

    <ProposalList
      className="sm:order-1"
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  </div>
);

const Governance: React.FC = () => {
  const useUrlPaginationProps = useUrlPagination();

  return <GovernanceUi {...useUrlPaginationProps} />;
};

export default Governance;

import { type UseUrlPaginationOutput, useUrlPagination } from 'hooks/useUrlPagination';

import ProposalList from './ProposalList';
import VotingWallet from './VotingWallet';

export type GovernancePageUiProps = UseUrlPaginationOutput;

export const GovernanceUi: React.FC<GovernancePageUiProps> = ({ currentPage, setCurrentPage }) => (
  <div className="space-y-10 lg:space-y-0 sm:grid lg:grid-cols-[2fr,1fr] lg:gap-x-8">
    <VotingWallet className="lg:order-2" />

    <ProposalList
      className="lg:order-1"
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

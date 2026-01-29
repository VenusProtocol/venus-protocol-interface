import { type UseUrlPaginationOutput, useUrlPagination } from 'hooks/useUrlPagination';

import { Page } from 'components';
import ProposalList from './ProposalList';
import VotingWallet from './VotingWallet';

export type GovernancePageUiProps = UseUrlPaginationOutput;

export const GovernanceUi: React.FC<GovernancePageUiProps> = ({ currentPage, setCurrentPage }) => (
  <Page>
    <div className="space-y-10 lg:space-y-0 sm:grid lg:grid-cols-[2fr_1fr] lg:gap-x-6">
      <VotingWallet className="lg:order-2" />

      <ProposalList
        className="lg:order-1"
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  </Page>
);

const Governance: React.FC = () => {
  const useUrlPaginationProps = useUrlPagination();

  return <GovernanceUi {...useUrlPaginationProps} />;
};

export default Governance;

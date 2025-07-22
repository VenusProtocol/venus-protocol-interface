import { type UseUrlPaginationOutput, useUrlPagination } from 'hooks/useUrlPagination';

import { Page } from 'components';
import ProposalList from './ProposalList';
import VotingWallet from './VotingWallet';

export type GovernancePageUiProps = UseUrlPaginationOutput;

export const GovernanceUi: React.FC<GovernancePageUiProps> = ({ currentPage, setCurrentPage }) => (
  <Page indexWithSearchEngines={false}>
    <div className="space-y-10 xl:space-y-0 sm:grid xl:grid-cols-[2fr,1fr] xl:gap-x-6">
      <VotingWallet className="xl:order-2" />

      <ProposalList
        className="xl:order-1"
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

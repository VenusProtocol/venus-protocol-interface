import { useParams } from 'react-router';

import { useGetVoterDetails, useGetVoterHistory, useGetVoters } from 'clients/api';
import { Page } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';

import History from './History';
import Holding from './Holding';
import Transactions from './Transactions';

const Voter: React.FC = () => {
  const { currentPage, setCurrentPage } = useUrlPagination();

  const { address = '' } = useParams<{ address: string }>();
  const { data: voterDetails } = useGetVoterDetails({ address });
  const { data: latestVotes } = useGetVoters({ address, limit: 3 });
  const {
    data: { voterHistory, total, limit } = { voterHistory: [], total: 0, limit: 16 },
    isFetching: isGetVoterHistoryFetching,
    isPlaceholderData: isGetVoterHistoryPreviousData,
  } = useGetVoterHistory({ address, page: currentPage });

  const isFetching =
    isGetVoterHistoryFetching && (isGetVoterHistoryPreviousData || voterHistory.length === 0);

  return (
    <Page>
      <div className="flex flex-1 flex-col">
        <div className="mb-4 flex flex-1 flex-col sm:mb-10 xl:flex-row">
          <Holding
            className="flex flex-1 xl:mr-4"
            balanceMantissa={voterDetails?.balanceMantissa}
            delegateCount={voterDetails?.delegateCount}
            votesMantissa={voterDetails?.votesMantissa}
            delegating={!!voterDetails?.delegating}
          />

          <Transactions
            className="mt-6 flex flex-1 xl:ml-4 xl:mt-0"
            address={address}
            voterTransactions={latestVotes?.result}
          />
        </div>

        <History
          total={total}
          voterHistory={voterHistory}
          setCurrentPage={setCurrentPage}
          limit={limit}
          isFetching={isFetching}
        />
      </div>
    </Page>
  );
};

export default Voter;

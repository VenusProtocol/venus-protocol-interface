import type BigNumber from 'bignumber.js';
import { useParams } from 'react-router';

import { useGetVoterDetails, useGetVoterHistory, useGetVoters } from 'clients/api';
import { useUrlPagination } from 'hooks/useUrlPagination';
import type { VoteDetail, VoterHistory } from 'types';

import { Page } from 'components';
import History from './History';
import Holding from './Holding';
import Transactions from './Transactions';

interface VoterUiProps {
  balanceMantissa: BigNumber | undefined;
  delegateCount: number | undefined;
  votesMantissa: BigNumber | undefined;
  delegating: boolean;
  address: string;
  latestVotes: VoteDetail[] | undefined;
  voterHistory: VoterHistory[] | undefined;
  setCurrentPage: (page: number) => void;
  total: number;
  limit: number;
  isHistoryFetching: boolean;
}

export const VoterUi: React.FC<VoterUiProps> = ({
  balanceMantissa,
  delegateCount,
  votesMantissa,
  delegating,
  address,
  latestVotes,
  voterHistory,
  setCurrentPage,
  total,
  limit,
  isHistoryFetching,
}) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 flex flex-1 flex-col sm:mb-10 xl:flex-row">
        <Holding
          className="flex flex-1 xl:mr-4"
          balanceMantissa={balanceMantissa}
          delegateCount={delegateCount}
          votesMantissa={votesMantissa}
          delegating={delegating}
        />

        <Transactions
          className="mt-6 flex flex-1 xl:ml-4 xl:mt-0"
          address={address}
          voterTransactions={latestVotes}
        />
      </div>

      <History
        total={total}
        voterHistory={voterHistory}
        setCurrentPage={setCurrentPage}
        limit={limit}
        isFetching={isHistoryFetching}
      />
    </div>
  );
};

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
      <VoterUi
        balanceMantissa={voterDetails?.balanceMantissa}
        delegateCount={voterDetails?.delegateCount}
        voterHistory={voterHistory}
        votesMantissa={voterDetails?.votesMantissa}
        delegating={!!voterDetails?.delegating}
        address={address}
        latestVotes={latestVotes?.result}
        setCurrentPage={setCurrentPage}
        total={total}
        limit={limit}
        isHistoryFetching={isFetching}
      />
    </Page>
  );
};

export default Voter;

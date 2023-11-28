/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { useGetVoterDetails, useGetVoterHistory, useGetVoters } from 'clients/api';
import useUrlPagination from 'hooks/useUrlPagination';
import { VoteDetail, VoterHistory } from 'types';

import History from './History';
import Holding from './Holding';
import Transactions from './Transactions';
import { useStyles } from './styles';

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
  const styles = useStyles();

  return (
    <div css={styles.root}>
      <div css={styles.top}>
        <Holding
          css={styles.topRowLeft}
          balanceMantissa={balanceMantissa}
          delegateCount={delegateCount}
          votesMantissa={votesMantissa}
          delegating={delegating}
        />

        <Transactions css={styles.topRowRight} address={address} voterTransactions={latestVotes} />
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
    isPreviousData: isGetVoterHistoryPreviousData,
  } = useGetVoterHistory({ address, page: currentPage });

  const isFetching =
    isGetVoterHistoryFetching && (isGetVoterHistoryPreviousData || voterHistory.length === 0);

  return (
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
  );
};

export default Voter;

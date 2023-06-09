/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import React from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { VoteDetailTransaction, VoterHistory } from 'types';

import { useGetVoterDetails, useGetVoterHistory } from 'clients/api';
import useUrlPagination from 'hooks/useUrlPagination';

import History from './History';
import Holding from './Holding';
import Transactions from './Transactions';
import { useStyles } from './styles';

interface VoterUiProps {
  balanceWei: BigNumber | undefined;
  delegateCount: number | undefined;
  votesWei: BigNumber | undefined;
  delegating: boolean;
  address: string;
  voterTransactions: VoteDetailTransaction[] | undefined;
  voterHistory: VoterHistory[] | undefined;
  setCurrentPage: (page: number) => void;
  total: number;
  limit: number;
  isHistoryFetching: boolean;
}

export const VoterUi: React.FC<VoterUiProps> = ({
  balanceWei,
  delegateCount,
  votesWei,
  delegating,
  address,
  voterTransactions,
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
          balanceWei={balanceWei}
          delegateCount={delegateCount}
          votesWei={votesWei}
          delegating={delegating}
        />

        <Transactions
          css={styles.topRowRight}
          address={address}
          voterTransactions={voterTransactions}
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

export type VoterDetailsPageProps = RouteComponentProps;

const Voter: React.FC<VoterDetailsPageProps> = ({ history, location }) => {
  const { currentPage, setCurrentPage } = useUrlPagination({ history, location });

  const { address } = useParams<{ address: string }>();
  const { data: voterDetails } = useGetVoterDetails({ address });
  const {
    data: { voterHistory, total, limit } = { voterHistory: [], total: 0, limit: 16 },
    isLoading: isGetVoterHistoryLoading,
    isFetching: isGetVoterHistoryFetching,
    isPreviousData: isGetVoterHistoryPreviousData,
  } = useGetVoterHistory({ address, page: currentPage });

  const isFetching =
    isGetVoterHistoryLoading || (isGetVoterHistoryFetching && isGetVoterHistoryPreviousData);

  return (
    <VoterUi
      balanceWei={voterDetails?.balanceWei}
      delegateCount={voterDetails?.delegateCount}
      voterHistory={voterHistory}
      votesWei={voterDetails?.votesWei}
      delegating={!!voterDetails?.delegating}
      address={address}
      voterTransactions={voterDetails?.voterTransactions}
      setCurrentPage={setCurrentPage}
      total={total}
      limit={limit}
      isHistoryFetching={isFetching}
    />
  );
};

export default Voter;

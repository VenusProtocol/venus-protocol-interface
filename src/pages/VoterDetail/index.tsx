/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';
import { useGetVoterDetail, useGetVoterHistory } from 'clients/api';
import { VoteDetailTransaction, IVoterHistory } from 'types';
import Holding from './Holding';
import Transactions from './Transactions';
import History from './History';
import { useStyles } from './styles';

interface VoterDetailUiProps {
  balanceWei: BigNumber | undefined;
  delegateCount: number | undefined;
  votesWei: BigNumber | undefined;
  delegating: boolean;
  address: string;
  voterTransactions: VoteDetailTransaction[] | undefined;
  voterHistory: IVoterHistory[] | undefined;
  setCurrentHistoryPage: (page: number) => void;
  total: number;
  limit: number;
  isHistoryFetching: boolean;
}

export const VoterDetailUi: React.FC<VoterDetailUiProps> = ({
  balanceWei,
  delegateCount,
  votesWei,
  delegating,
  address,
  voterTransactions,
  voterHistory,
  setCurrentHistoryPage,
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
        setCurrentPage={setCurrentHistoryPage}
        limit={limit}
        isFetching={isHistoryFetching}
      />
    </div>
  );
};

const VoterDetail = () => {
  const [currentHistoryPage, setCurrentHistoryPage] = useState(0);
  const { address } = useParams<{ address: string }>();
  const { data: voterDetail } = useGetVoterDetail({ address });
  const {
    data: { voterHistory, total, limit } = { voterHistory: undefined, total: 0, limit: 0 },
    isFetching,
  } = useGetVoterHistory({ address, page: currentHistoryPage });
  return (
    <VoterDetailUi
      balanceWei={voterDetail?.balanceWei}
      delegateCount={voterDetail?.delegateCount}
      voterHistory={voterHistory}
      votesWei={voterDetail?.votesWei}
      delegating={!!voterDetail?.delegating}
      address={address}
      voterTransactions={voterDetail?.voterTransactions}
      setCurrentHistoryPage={setCurrentHistoryPage}
      total={total}
      limit={limit}
      isHistoryFetching={isFetching}
    />
  );
};

export default VoterDetail;

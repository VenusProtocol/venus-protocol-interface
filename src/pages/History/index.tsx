/** @jsxImportSource @emotion/react */
import { Pagination } from 'components';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Transaction, TransactionEvent } from 'types';

import { useGetTransactions } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useUrlPagination from 'hooks/useUrlPagination';

import Filters, { ALL_VALUE, FilterProps } from './Filters';
import HistoryTable from './HistoryTable';

interface HistoryUiProps extends FilterProps {
  transactions: Transaction[];
  isFetching: boolean;
  total: number | undefined;
  limit: number | undefined;
  setCurrentPage: (page: number) => void;
}

export const HistoryUi: React.FC<HistoryUiProps> = ({
  eventType,
  setEventType,
  showOnlyMyTxns,
  setShowOnlyMyTxns,
  transactions,
  walletConnected,
  isFetching,
  total,
  limit,
  setCurrentPage,
}) => (
  <div>
    <Filters
      eventType={eventType}
      setEventType={setEventType}
      showOnlyMyTxns={showOnlyMyTxns}
      setShowOnlyMyTxns={setShowOnlyMyTxns}
      walletConnected={walletConnected}
    />

    <HistoryTable transactions={transactions} isFetching={isFetching} />

    {total ? (
      <Pagination itemsCount={total} onChange={setCurrentPage} itemsPerPageCount={limit || 20} />
    ) : null}
  </div>
);

export type HistoryPageProps = RouteComponentProps;

const History: React.FC<RouteComponentProps> = ({ history, location }) => {
  const { currentPage, setCurrentPage } = useUrlPagination({
    history,
    location,
  });

  const { accountAddress } = useAuth();

  const [eventType, setEventType] = useState<TransactionEvent | typeof ALL_VALUE>(ALL_VALUE);
  const [showOnlyMyTxns, setShowOnlyMyTxns] = useState(false);
  const {
    data: { transactions, total, limit } = { transactions: [] },
    isFetching: isGetTransactionsFetching,
    isPreviousData: isGetTransactionsPreviousData,
  } = useGetTransactions({
    page: currentPage,
    address: showOnlyMyTxns ? accountAddress : undefined,
    event: eventType !== ALL_VALUE ? eventType : undefined,
  });

  const isFetching =
    isGetTransactionsFetching && (isGetTransactionsPreviousData || transactions.length === 0);

  return (
    <HistoryUi
      eventType={eventType}
      setEventType={setEventType}
      showOnlyMyTxns={showOnlyMyTxns}
      setShowOnlyMyTxns={setShowOnlyMyTxns}
      transactions={transactions}
      walletConnected={!!accountAddress}
      isFetching={isFetching}
      total={total}
      limit={limit}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default History;

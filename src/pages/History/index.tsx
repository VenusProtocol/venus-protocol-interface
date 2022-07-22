/** @jsxImportSource @emotion/react */
import { Pagination } from 'components';
import React, { useContext, useState } from 'react';
import { Transaction, TransactionEvent } from 'types';

import { useGetTransactions } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

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
      <Pagination
        itemsCount={total}
        onChange={(nextIndex: number) => {
          setCurrentPage(nextIndex);
          window.scrollTo(0, 0);
        }}
        itemsPerPageCount={limit || 20}
      />
    ) : null}
  </div>
);

const History: React.FC = () => {
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address;
  const [currentPage, setCurrentPage] = useState(0);
  const [eventType, setEventType] = useState<TransactionEvent | typeof ALL_VALUE>(ALL_VALUE);
  const [showOnlyMyTxns, setShowOnlyMyTxns] = useState(false);
  const { data: { transactions, total, limit } = { transactions: [] }, isFetching } =
    useGetTransactions({
      page: currentPage,
      address: showOnlyMyTxns ? accountAddress : undefined,
      event: eventType !== ALL_VALUE ? eventType : undefined,
    });

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

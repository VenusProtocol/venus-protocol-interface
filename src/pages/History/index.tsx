/** @jsxImportSource @emotion/react */
import React, { useContext, useState } from 'react';
import { ITransaction, TransactionEvent } from 'types';
import { AuthContext } from 'context/AuthContext';
import { useGetTransactions } from 'clients/api';
import { Pagination } from 'components';
import HistoryTable from './HistoryTable';
import Filters, { ALL_VALUE, IFilterProps } from './Filters';

interface IHistoryUiProps extends IFilterProps {
  transactions: ITransaction[];
  isFetching: boolean;
  total: number | undefined;
  limit: number | undefined;
  setCurrentPage: (page: number) => void;
}

export const HistoryUi: React.FC<IHistoryUiProps> = ({
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

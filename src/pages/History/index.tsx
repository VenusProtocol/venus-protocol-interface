/** @jsxImportSource @emotion/react */
import React, { useContext, useState } from 'react';
import { Transaction } from 'models';
import { TransactionEvent } from 'types';
import { AuthContext } from 'context/AuthContext';
import { useGetTransactions } from 'clients/api';
import HistoryTable from './HistoryTable';
import Filters, { ALL_VALUE, IFilterProps } from './Filters';

interface IHistoryUiProps extends IFilterProps {
  transactions: Transaction[];
  isFetching: boolean;
}

export const HistoryUi: React.FC<IHistoryUiProps> = ({
  eventType,
  setEventType,
  showOnlyMyTxns,
  setShowOnlyMyTxns,
  transactions,
  walletConnected,
  isFetching,
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
  </div>
);

const History: React.FC = () => {
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address;
  const [eventType, setEventType] = useState<TransactionEvent | typeof ALL_VALUE>(ALL_VALUE);
  const [showOnlyMyTxns, setShowOnlyMyTxns] = useState(false);
  const { data: { transactions } = { transactions: [] }, isFetching } = useGetTransactions(
    {
      address: showOnlyMyTxns ? accountAddress : undefined,
      event: eventType !== ALL_VALUE ? eventType : undefined,
    },
    { placeholderData: { transactions: [], limit: 0, page: 0, total: 0 } },
  );
  return (
    <HistoryUi
      eventType={eventType}
      setEventType={setEventType}
      showOnlyMyTxns={showOnlyMyTxns}
      setShowOnlyMyTxns={setShowOnlyMyTxns}
      transactions={transactions}
      walletConnected={!!accountAddress}
      isFetching={isFetching}
    />
  );
};

export default History;

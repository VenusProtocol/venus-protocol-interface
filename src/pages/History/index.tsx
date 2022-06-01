/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Transaction } from 'models';
import { TransactionEvent } from 'types';
import { useGetTransactions } from 'clients/api';
import HistoryTable from './HistoryTable';
import Filters, { ALL_VALUE, IFilterProps } from './Filters';

interface IHistoryUiProps extends IFilterProps {
  transactions: Transaction[];
}

export const HistoryUi: React.FC<IHistoryUiProps> = ({
  eventType,
  setEventType,
  showOnlyMyTxns,
  setShowOnlyMyTxns,
  transactions,
}) => (
  <div>
    <Filters
      eventType={eventType}
      setEventType={setEventType}
      showOnlyMyTxns={showOnlyMyTxns}
      setShowOnlyMyTxns={setShowOnlyMyTxns}
    />
    <HistoryTable transactions={transactions} />
  </div>
);

const History: React.FC = () => {
  const [eventType, setEventType] = useState<TransactionEvent | typeof ALL_VALUE>(ALL_VALUE);
  const [showOnlyMyTxns, setShowOnlyMyTxns] = useState(false);
  const { data: { transactions } = { transactions: [] } } = useGetTransactions(
    {},
    { placeholderData: { transactions: [], limit: 0, page: 0, total: 0 } },
  );
  return (
    <HistoryUi
      eventType={eventType}
      setEventType={setEventType}
      showOnlyMyTxns={showOnlyMyTxns}
      setShowOnlyMyTxns={setShowOnlyMyTxns}
      transactions={transactions}
    />
  );
};

export default History;

/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { TransactionEvent } from 'types';
import HistoryTable from './HistoryTable';
import Filters, { ALL_VALUE, IFilterProps } from './Filters';

interface IHistoryUiProps extends IFilterProps {
  transactions: [];
}

export const HistoryUi: React.FC<IHistoryUiProps> = ({
  eventType,
  setEventType,
  showOnlyMyTxns,
  setShowOnlyMyTxns,
}) => (
  <div>
    <Filters
      eventType={eventType}
      setEventType={setEventType}
      showOnlyMyTxns={showOnlyMyTxns}
      setShowOnlyMyTxns={setShowOnlyMyTxns}
    />
    <HistoryTable />
  </div>
);

const History: React.FC = () => {
  const [eventType, setEventType] = useState<TransactionEvent | typeof ALL_VALUE>(ALL_VALUE);
  const [showOnlyMyTxns, setShowOnlyMyTxns] = useState(false);
  return (
    <HistoryUi
      eventType={eventType}
      setEventType={setEventType}
      showOnlyMyTxns={showOnlyMyTxns}
      setShowOnlyMyTxns={setShowOnlyMyTxns}
      transactions={[]}
    />
  );
};

export default History;

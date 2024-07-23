/** @jsxImportSource @emotion/react */
import { useState } from 'react';

import { useGetTransactions, useGetVTokens } from 'clients/api';
import { Pagination } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';
import { useAccountAddress } from 'libs/wallet';
import type { Transaction, TransactionEvent } from 'types';

import Filters, { ALL_VALUE, type FilterProps } from './Filters';
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

const History: React.FC = () => {
  const { currentPage, setCurrentPage } = useUrlPagination();
  const { accountAddress } = useAccountAddress();

  const { data: getVTokenData, isLoading: isGetVTokensLoading } = useGetVTokens();
  const vTokens = getVTokenData?.vTokens || [];

  const [eventType, setEventType] = useState<TransactionEvent | typeof ALL_VALUE>(ALL_VALUE);

  const handleSetEventType = (newEventType: TransactionEvent | typeof ALL_VALUE) => {
    // Reset current page
    setCurrentPage(0);
    setEventType(newEventType);
  };

  const [showOnlyMyTxns, setShowOnlyMyTxns] = useState(false);
  const {
    data: { transactions, total, limit } = { transactions: [] },
    isRefetching: isGetTransactionsRefetching,
    isFetching: isGetTransactionsFetching,
    isPlaceholderData: isGetTransactionsPreviousData,
  } = useGetTransactions(
    {
      page: currentPage,
      from: showOnlyMyTxns ? accountAddress : undefined,
      event: eventType !== ALL_VALUE ? eventType : undefined,
      vTokens,
    },
    {
      enabled: vTokens.length > 0,
    },
  );

  const isFetching =
    isGetVTokensLoading ||
    ((isGetTransactionsFetching || isGetTransactionsRefetching) &&
      (isGetTransactionsPreviousData || transactions.length === 0));

  return (
    <HistoryUi
      eventType={eventType}
      setEventType={handleSetEventType}
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

import { useGetAccountTransactionHistory } from 'clients/api';
import { TransactionsList } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { useAccountAddress } from 'libs/wallet';
import type { YieldPlusPosition } from 'types';

export interface TransactionsTabProps {
  row: YieldPlusPosition;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({ row }) => {
  const { accountAddress } = useAccountAddress();

  const { data: getTransactionsData, isLoading } = useGetAccountTransactionHistory({
    accountAddress: accountAddress || NULL_ADDRESS,
    positionAccountAddress: row.positionAccountAddress,
  });

  const transactions = getTransactionsData?.transactions || [];

  // Filter out transactions from passed cycles
  const lastCycledId = transactions.find(tx => 'cycleId' in tx)?.cycleId || '1';

  const filteredTransactions = transactions.filter(
    tx => 'cycleId' in tx && tx.cycleId === lastCycledId,
  );

  return <TransactionsList transactions={filteredTransactions} isLoading={isLoading} />;
};

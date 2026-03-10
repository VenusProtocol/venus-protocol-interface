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
    page: 1, // TODO: add pagination
  });

  const transactions = getTransactionsData?.transactions || [];

  return <TransactionsList transactions={transactions} isLoading={isLoading} />;
};

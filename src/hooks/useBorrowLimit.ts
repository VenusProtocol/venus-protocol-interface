import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useWeb3Account } from '../clients/web3';
import { useMarketsUser } from './useMarketsUser';

export const useBorrowLimit = () => {
  const [available, setAvailable] = useState('0');
  const [borrowPercent, setBorrowPercent] = useState(0);
  const { account } = useWeb3Account();
  const { userTotalBorrowLimit, userTotalBorrowBalance } = useMarketsUser();

  useEffect(() => {
    if (!account) return;

    const total = BigNumber.maximum(userTotalBorrowLimit, 0);
    setAvailable(total.dp(2, 1).toString(10));

    if (total.isZero() || total.isNaN()) {
      return;
    }

    setBorrowPercent(userTotalBorrowBalance.div(total).times(100).dp(0, 1).toNumber());
  }, [account, userTotalBorrowBalance, userTotalBorrowLimit]);

  return { available, borrowPercent };
};

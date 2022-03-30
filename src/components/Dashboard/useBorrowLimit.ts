import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useWeb3Account } from '../../clients/web3';
import { useMarketsUser } from '../../hooks/useMarketsUser';

export const useBorrowLimit = () => {
  const [available, setAvailable] = useState('0');
  const [borrowPercent, setBorrowPercent] = useState(0);
  const { account } = useWeb3Account();
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useMarketsUser();

  useEffect(() => {
    if (account) {
      const total = BigNumber.maximum(userTotalBorrowLimit, 0);
      setAvailable(total.dp(2, 1).toString(10));
      setBorrowPercent(
        total.isZero() || total.isNaN()
          ? 0
          : userTotalBorrowBalance.div(total).times(100).dp(0, 1).toNumber(),
      );
    }
  }, [userTotalBorrowBalance, userTotalBorrowLimit]);

  return {
    available,
    borrowPercent,
  };
};

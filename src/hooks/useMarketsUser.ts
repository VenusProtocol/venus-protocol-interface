import { useContext } from 'react';
import { MarketContext } from '../context/MarketContext';

export const useMarketsUser = () => {
  const {
    userMarketInfo,
    userTotalBorrowLimit,
    userTotalBorrowBalance,
    userXVSBalance
  } = useContext(MarketContext);
  return {
    userMarketInfo,
    userTotalBorrowLimit,
    userTotalBorrowBalance,
    userXVSBalance
  };
};

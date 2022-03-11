import { useContext } from 'react';
import { MarketContext } from '../context/MarketContext';

export const useMarkets = () => {
  const { markets, dailyVenus, treasuryTotalUSDBalance } = useContext(MarketContext);
  return { markets, dailyVenus, treasuryTotalUSDBalance };
};

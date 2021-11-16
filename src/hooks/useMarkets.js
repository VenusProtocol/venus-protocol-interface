import { useContext } from 'react';
import { MarketContext } from '../context/MarketContext';

export const useMarkets = () => {
  const { markets, dailyVenus } = useContext(MarketContext);
  return { markets, dailyVenus };
};

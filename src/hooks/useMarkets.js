import { useEffect, useState } from 'react';
import { fetchMarkets } from '../utilities/api';
import useRefresh from './useRefresh';
import * as constants from '../utilities/constants';

export const useMarkets = () => {
  const [markets, setMarkets] = useState([]);
  const [dailyVenus, setDailyVenus] = useState(0);
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const getMarkets = async () => {
      const res = await fetchMarkets();
      if (!res.data || !res.data.status) {
        return;
      }

      const data = Object.keys(constants.CONTRACT_VBEP_ADDRESS)
        .map(item =>
          res.data.data.markets.find(
            market =>
              market.underlyingSymbol.toLowerCase() === item.toLowerCase()
          )
        )
        .filter(item => !!item);
      setMarkets(data);
      setDailyVenus(res.data.data.dailyVenus);
    };
    getMarkets();
  }, [fastRefresh]);

  return { markets, dailyVenus };
};

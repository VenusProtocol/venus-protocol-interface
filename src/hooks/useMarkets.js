import { useEffect, useState } from 'react';
import useRefresh from './useRefresh';
import { getETHPrice } from '../utils/utils';

export const useMarkets = () => {
  const [markets, setMarkets] = useState([]);
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const getMarkets = async () => {
      const res = await promisify(getGovernanceVenus, {});
      if (!res.status) {
        return;
      }

      const res = Object.keys(constants.CONTRACT_VBEP_ADDRESS)
        .map(item =>
          res.data.markets.find(
            market =>
              market.underlyingSymbol.toLowerCase() === item.toLowerCase()
          )
        )
        .filter(item => !!item);
      setMarkets(res);
    };
    getMarkets();
  }, [fastRefresh]);

  return markets;
};

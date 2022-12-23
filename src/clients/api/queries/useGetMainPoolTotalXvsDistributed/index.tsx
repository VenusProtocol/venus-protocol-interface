import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { convertTokensToWei } from 'utilities';

import { useGetMainMarkets } from 'clients/api';
import { TOKENS } from 'constants/tokens';

export interface Data {
  totalXvsDistributedWei: BigNumber;
}

export interface UseGetMainPoolTotalXvsDistributed {
  isLoading: boolean;
  data: Data;
}

const useGetMainPoolTotalXvsDistributed = () => {
  const { data: getMainMarketsData, isLoading: isGetMainMarketsLoading } = useGetMainMarkets();

  const totalXvsDistributedWei = useMemo(() => {
    const totalXvsDistributedTokens = (getMainMarketsData?.markets || []).reduce(
      (acc, market) => acc.plus(market.totalDistributed),
      new BigNumber(0),
    );

    return convertTokensToWei({
      value: totalXvsDistributedTokens,
      token: TOKENS.xvs,
    });
  }, [getMainMarketsData?.markets]);

  return { isLoading: isGetMainMarketsLoading, data: { totalXvsDistributedWei } };
};

export default useGetMainPoolTotalXvsDistributed;

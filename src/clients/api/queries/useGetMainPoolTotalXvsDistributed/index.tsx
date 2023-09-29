import BigNumber from 'bignumber.js';
import { useGetToken } from 'packages/tokens';
import { useMemo } from 'react';
import { convertTokensToWei } from 'utilities';

import { useGetMainMarkets } from 'clients/api';

export interface UseGetMainPoolTotalXvsDistributedOutput {
  isLoading: boolean;
  data?: {
    totalXvsDistributedWei: BigNumber;
  };
}

// TODO: get from subgraph

const useGetMainPoolTotalXvsDistributed = (): UseGetMainPoolTotalXvsDistributedOutput => {
  const { data: getMainMarketsData, isLoading: isGetMainAssetsLoading } = useGetMainMarkets();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const totalXvsDistributedWei = useMemo(() => {
    const totalXvsDistributedTokens =
      getMainMarketsData?.markets &&
      getMainMarketsData.markets.reduce(
        (acc, market) => acc.plus(market.totalXvsDistributedTokens),
        new BigNumber(0),
      );

    return (
      totalXvsDistributedTokens &&
      xvs &&
      convertTokensToWei({
        value: totalXvsDistributedTokens,
        token: xvs,
      })
    );
  }, [getMainMarketsData?.markets, xvs]);

  return {
    isLoading: isGetMainAssetsLoading,
    data: totalXvsDistributedWei && { totalXvsDistributedWei },
  };
};

export default useGetMainPoolTotalXvsDistributed;

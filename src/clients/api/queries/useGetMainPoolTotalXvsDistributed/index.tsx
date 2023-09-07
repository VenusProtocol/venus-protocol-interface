import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { convertTokensToWei } from 'utilities';

import { useGetMainMarkets } from 'clients/api';
import { TOKENS } from 'constants/tokens';

export interface UseGetMainPoolTotalXvsDistributedOutput {
  isLoading: boolean;
  data?: {
    totalXvsDistributedWei: BigNumber;
  };
}

// TODO: get from subgraph

const useGetMainPoolTotalXvsDistributed = (): UseGetMainPoolTotalXvsDistributedOutput => {
  const { data: getMainMarketsData, isLoading: isGetMainAssetsLoading } = useGetMainMarkets();

  const totalXvsDistributedWei = useMemo(() => {
    const totalXvsDistributedTokens =
      getMainMarketsData?.markets &&
      getMainMarketsData.markets.reduce(
        (acc, market) => acc.plus(market.totalXvsDistributedTokens),
        new BigNumber(0),
      );

    return (
      totalXvsDistributedTokens &&
      convertTokensToWei({
        value: totalXvsDistributedTokens,
        token: TOKENS.xvs,
      })
    );
  }, [getMainMarketsData?.markets]);

  return {
    isLoading: isGetMainAssetsLoading,
    data: totalXvsDistributedWei && { totalXvsDistributedWei },
  };
};

export default useGetMainPoolTotalXvsDistributed;

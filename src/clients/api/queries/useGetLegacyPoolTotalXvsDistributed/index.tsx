import BigNumber from 'bignumber.js';
import { useGetToken } from 'packages/tokens';
import { useMemo } from 'react';
import { convertTokensToMantissa } from 'utilities';

import { useGetLegacyPoolMarkets } from 'clients/api';

export interface UseGetLegacyPoolTotalXvsDistributedOutput {
  isLoading: boolean;
  data?: {
    totalXvsDistributedMantissa: BigNumber;
  };
}

// TODO: get from subgraph

const useGetLegacyPoolTotalXvsDistributed = (): UseGetLegacyPoolTotalXvsDistributedOutput => {
  const { data: getLegacyPoolMarketsData, isLoading: isGetMainAssetsLoading } =
    useGetLegacyPoolMarkets();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const totalXvsDistributedMantissa = useMemo(() => {
    const totalXvsDistributedTokens =
      getLegacyPoolMarketsData?.markets &&
      getLegacyPoolMarketsData.markets.reduce(
        (acc, market) => acc.plus(market.totalXvsDistributedTokens),
        new BigNumber(0),
      );

    return (
      totalXvsDistributedTokens &&
      xvs &&
      convertTokensToMantissa({
        value: totalXvsDistributedTokens,
        token: xvs,
      })
    );
  }, [getLegacyPoolMarketsData?.markets, xvs]);

  return {
    isLoading: isGetMainAssetsLoading,
    data: totalXvsDistributedMantissa && { totalXvsDistributedMantissa },
  };
};

export default useGetLegacyPoolTotalXvsDistributed;

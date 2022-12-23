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

const useGetMainPoolTotalXvsDistributed = (): UseGetMainPoolTotalXvsDistributedOutput => {
  const { data: getMainMarketsData, isLoading: isGetMainMarketsLoading } = useGetMainMarkets();

  const totalXvsDistributedWei = useMemo(() => {
    const totalXvsDistributedTokens =
      getMainMarketsData?.markets &&
      getMainMarketsData.markets.reduce(
        (acc, market) => acc.plus(market.totalDistributed),
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
    isLoading: isGetMainMarketsLoading,
    data: totalXvsDistributedWei && { totalXvsDistributedWei },
  };
};

export default useGetMainPoolTotalXvsDistributed;

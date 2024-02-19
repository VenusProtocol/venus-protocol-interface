import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetTokenBalances } from 'clients/api';
import { Options as UseGetTokenBalancesOptions } from 'clients/api/queries/getTokenBalances/useGetTokenBalances';
import { useGetSwapTokens } from 'libs/tokens';
import { TokenBalance } from 'types';

import { useIsFeatureEnabled } from './useIsFeatureEnabled';

const useGetSwapTokenUserBalances = (
  {
    accountAddress,
  }: {
    accountAddress?: string;
  },
  options: UseGetTokenBalancesOptions = {},
) => {
  const isIntegratedSwapEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });
  const swapTokens = useGetSwapTokens();
  // By default we return the list of tokens with undefined balances so they can
  // still be listed while balances are being fetched
  const defaultTokenBalances: TokenBalance[] = useMemo(
    () =>
      isIntegratedSwapEnabled
        ? swapTokens.map(token => ({
            token,
            balanceMantissa: new BigNumber(0),
          }))
        : [],
    [swapTokens, isIntegratedSwapEnabled],
  );

  const { data } = useGetTokenBalances(
    {
      accountAddress: accountAddress || '',
      tokens: swapTokens,
    },
    {
      ...options,
      enabled: isIntegratedSwapEnabled && !!accountAddress && (!options || options.enabled),
    },
  );

  return {
    data: data?.tokenBalances || defaultTokenBalances,
  };
};

export default useGetSwapTokenUserBalances;

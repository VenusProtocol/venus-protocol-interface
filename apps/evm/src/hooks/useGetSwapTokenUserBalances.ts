import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetTokenBalances } from 'clients/api';
import type { Options as UseGetTokenBalancesOptions } from 'clients/api/queries/getTokenBalances/useGetTokenBalances';
import { useGetTokens } from 'libs/tokens';
import type { TokenBalance } from 'types';

import { NULL_ADDRESS } from 'constants/address';
import type { Address } from 'viem';
import { useIsFeatureEnabled } from './useIsFeatureEnabled';

const useGetSwapTokenUserBalances = (
  {
    accountAddress,
  }: {
    accountAddress?: Address;
  },
  options: Partial<UseGetTokenBalancesOptions> = {},
) => {
  const isIntegratedSwapEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });
  const tokens = useGetTokens();
  // By default we return the list of tokens with undefined balances so they can
  // still be listed while balances are being fetched
  const defaultTokenBalances: TokenBalance[] = useMemo(
    () =>
      isIntegratedSwapEnabled
        ? tokens.map(token => ({
            token,
            balanceMantissa: new BigNumber(0),
          }))
        : [],
    [tokens, isIntegratedSwapEnabled],
  );

  const { data } = useGetTokenBalances(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      tokens,
    },
    {
      ...options,
      enabled:
        isIntegratedSwapEnabled &&
        !!accountAddress &&
        (!options?.enabled === undefined || options.enabled),
    },
  );

  return {
    data: data?.tokenBalances || defaultTokenBalances,
  };
};

export default useGetSwapTokenUserBalances;

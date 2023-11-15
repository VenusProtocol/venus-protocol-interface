import BigNumber from 'bignumber.js';
import { useGetSwapTokens } from 'packages/tokens';
import { useMemo } from 'react';
import { TokenBalance } from 'types';

import { useGetTokenBalances } from 'clients/api';
import { Options as UseGetTokenBalancesOptions } from 'clients/api/queries/getTokenBalances/useGetTokenBalances';

const useGetSwapTokenUserBalances = (
  {
    accountAddress,
  }: {
    accountAddress?: string;
  },
  options: UseGetTokenBalancesOptions = {},
) => {
  const swapTokens = useGetSwapTokens();
  // By default we return the list of tokens with undefined balances so they can
  // still be listed while balances are being fetched
  const defaultTokenBalances: TokenBalance[] = useMemo(
    () =>
      swapTokens.map(token => ({
        token,
        balanceMantissa: new BigNumber(0),
      })),
    [swapTokens],
  );

  const { data } = useGetTokenBalances(
    {
      accountAddress: accountAddress || '',
      tokens: swapTokens,
    },
    {
      ...options,
      enabled: !!accountAddress && (!options || options.enabled),
    },
  );

  return {
    data: data?.tokenBalances || defaultTokenBalances,
  };
};

export default useGetSwapTokenUserBalances;

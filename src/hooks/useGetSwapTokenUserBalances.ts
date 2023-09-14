import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { TokenBalance } from 'types';

import { useGetTokenBalances } from 'clients/api';
import { Options as UseGetTokenBalancesOptions } from 'clients/api/queries/getTokenBalances/useGetTokenBalances';
import useGetPancakeSwapTokens from 'hooks/useGetPancakeSwapTokens';

const useGetSwapTokenUserBalances = (
  {
    accountAddress,
  }: {
    accountAddress?: string;
  },
  options: UseGetTokenBalancesOptions = {},
) => {
  const pancakeSwapTokens = useGetPancakeSwapTokens();
  // By default we return the list of tokens with undefined balances so they can
  // still be listed while balances are being fetched
  const defaultTokenBalances: TokenBalance[] = useMemo(
    () =>
      pancakeSwapTokens.map(token => ({
        token,
        balanceWei: new BigNumber(0),
      })),
    [pancakeSwapTokens],
  );

  const { data } = useGetTokenBalances(
    {
      accountAddress: accountAddress || '',
      tokens: pancakeSwapTokens,
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

import BigNumber from 'bignumber.js';
import { TokenBalance } from 'types';

import { useGetTokenBalances } from 'clients/api';
import { Options as UseGetTokenBalancesOptions } from 'clients/api/queries/getTokenBalances/useGetTokenBalances';
import { SWAP_TOKENS } from 'constants/tokens';

const tokens = Object.values(SWAP_TOKENS);

const useGetSwapTokenUserBalances = (
  {
    accountAddress,
  }: {
    accountAddress?: string;
  },
  options: UseGetTokenBalancesOptions = {},
) => {
  // By default we return the list of tokens with undefined balances so they can
  // still be listed while balances are being fetched
  const defaultTokenBalances: TokenBalance[] = tokens.map(token => ({
    token,
    balanceWei: new BigNumber(0),
  }));

  const { data } = useGetTokenBalances(
    {
      accountAddress: accountAddress || '',
      tokens,
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

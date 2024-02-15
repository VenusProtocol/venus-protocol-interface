import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetTokenBalances } from 'clients/api';
import { Options as UseGetTokenBalancesOptions } from 'clients/api/queries/getTokenBalances/useGetTokenBalances';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetTokens } from 'libs/tokens';
import { TokenBalance } from 'types';

const useGetNativeWrappedTokenUserBalances = (
  {
    accountAddress,
  }: {
    accountAddress?: string;
  },
  options: UseGetTokenBalancesOptions = {},
) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const allChainTokens = useGetTokens();
  const wrappedNativeTokens = useMemo(
    () => allChainTokens.filter(t => t.wrapsNative),
    [allChainTokens],
  );
  const { nativeToken } = useGetChainMetadata();

  const nativeAndWrappedNativeTokens = useMemo(
    () => [nativeToken, ...wrappedNativeTokens],
    [nativeToken, wrappedNativeTokens],
  );
  // By default we return the list of tokens with undefined balances so they can
  // still be listed while balances are being fetched
  const defaultTokenBalances: TokenBalance[] = useMemo(
    () =>
      isWrapUnwrapNativeTokenEnabled
        ? nativeAndWrappedNativeTokens.map(token => ({
            token,
            balanceMantissa: new BigNumber(0),
          }))
        : [],
    [nativeAndWrappedNativeTokens, isWrapUnwrapNativeTokenEnabled],
  );

  const { data } = useGetTokenBalances(
    {
      accountAddress: accountAddress || '',
      tokens: nativeAndWrappedNativeTokens,
    },
    {
      ...options,
      enabled: isWrapUnwrapNativeTokenEnabled && !!accountAddress && (!options || options.enabled),
    },
  );

  return {
    data: data?.tokenBalances || defaultTokenBalances,
  };
};

export default useGetNativeWrappedTokenUserBalances;

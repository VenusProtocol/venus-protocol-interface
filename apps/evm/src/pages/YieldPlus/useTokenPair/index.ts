import { useGetToken, useGetTokens } from 'libs/tokens';
import { useSearchParams } from 'react-router';

import { useChain } from 'hooks/useChain';
import { findTokenByAddress } from 'utilities';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from '../constants';

export const useTokenPair = () => {
  const [searchParams] = useSearchParams();
  const { nativeToken } = useChain();

  const tokens = useGetTokens();

  const defaultLongToken =
    useGetToken({
      symbol: 'USDT',
    }) || tokens[0];

  const defaultShortToken = nativeToken;

  const shortTokenAddress = searchParams.get(SHORT_TOKEN_ADDRESS_PARAM_KEY) || undefined;
  const longTokenAddress = searchParams.get(LONG_TOKEN_ADDRESS_PARAM_KEY) || undefined;

  let shortToken = shortTokenAddress
    ? findTokenByAddress({
        address: shortTokenAddress,
        tokens,
      })
    : undefined;

  let longToken = longTokenAddress
    ? findTokenByAddress({
        address: longTokenAddress,
        tokens,
      })
    : undefined;

  if (!shortToken || !longToken) {
    longToken = defaultLongToken;
    shortToken = defaultShortToken;
  }

  return {
    defaultLongToken,
    defaultShortToken,
    shortToken,
    longToken,
  };
};

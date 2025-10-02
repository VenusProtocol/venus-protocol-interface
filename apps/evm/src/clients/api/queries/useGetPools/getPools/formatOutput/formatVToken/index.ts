import { NATIVE_TOKEN_ADDRESS, getVTokenIconSrc } from '@venusprotocol/chains';
import type { ChainId, Token, VToken } from 'types';
import { findTokenByAddress } from 'utilities';
import type { ApiMarket } from '../../getApiPools';

export const formatVToken = ({
  apiMarket,
  tokens,
  chainId,
}: { apiMarket: ApiMarket; tokens: Token[]; chainId: ChainId }) => {
  // Retrieve underlying token record
  const underlyingToken = findTokenByAddress({
    tokens,
    address: apiMarket.underlyingAddress || NATIVE_TOKEN_ADDRESS,
  });

  if (!underlyingToken) {
    return undefined;
  }

  const vToken: VToken = {
    address: apiMarket.address,
    iconSrc: getVTokenIconSrc({ vTokenAddress: apiMarket.address, chainId }),
    decimals: 8,
    symbol: `v${underlyingToken.symbol}`,
    underlyingToken,
  };

  return vToken;
};

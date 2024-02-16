import { tokens } from 'tokens/commonTokens';

import { ChainId, Token } from 'types';

export interface GetTokenInput {
  chainId: ChainId;
  symbol: string;
}

export const getToken = ({ chainId, symbol }: GetTokenInput): Token | undefined => {
  const chainTokens = tokens[chainId];
  return chainTokens.find(token => token.symbol === symbol);
};

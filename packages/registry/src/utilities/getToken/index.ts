import { tokens } from '../../tokens';
import type { ChainId } from '../../types';

export interface GetTokenInput {
  chainId: ChainId;
  symbol: string;
}

export const getToken = ({ chainId, symbol }: GetTokenInput) => {
  const chainTokens = tokens[chainId];
  return chainTokens.find(token => token.symbol === symbol);
};

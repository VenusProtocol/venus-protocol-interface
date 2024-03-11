import type { ChainId } from 'types';

import { tokens } from '../../infos/commonTokens';

export interface GetTokenInput {
  chainId: ChainId;
  symbol: string;
}

export const getToken = ({ chainId, symbol }: GetTokenInput) => {
  const chainTokens = tokens[chainId];
  return chainTokens.find(token => token.symbol === symbol);
};

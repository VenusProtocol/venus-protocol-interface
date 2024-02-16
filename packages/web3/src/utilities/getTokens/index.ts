import { tokens } from 'tokens/commonTokens';

import { ChainId, Token } from 'types';

export interface GetTokensInput {
  chainId: ChainId;
}

export const getTokens = ({ chainId }: GetTokensInput): Token[] => tokens[chainId];

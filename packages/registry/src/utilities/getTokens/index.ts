import { tokens } from '../../tokens';
import type { ChainId } from '../../types';

export interface GetTokensInput {
  chainId: ChainId;
}

export const getTokens = ({ chainId }: GetTokensInput) => tokens[chainId];

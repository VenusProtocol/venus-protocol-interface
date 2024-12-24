import { tokens } from '@registry/tokens';
import type { ChainId } from '@registry/types';

export interface GetTokensInput {
  chainId: ChainId;
}

export const getTokens = ({ chainId }: GetTokensInput) => tokens[chainId];

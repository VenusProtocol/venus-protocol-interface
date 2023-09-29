import { tokens } from 'packages/tokens/tokenInfos/commonTokens';
import { ChainId } from 'types';

export interface GetTokensInput {
  chainId: ChainId;
}

export const getTokens = ({ chainId }: GetTokensInput) => tokens[chainId];

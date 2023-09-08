import { ChainId } from 'types';

import tokens from '../tokenInfos/common';

export interface GetTokensInput {
  chainId: ChainId;
}

export const getTokens = ({ chainId }: GetTokensInput) => tokens[chainId];

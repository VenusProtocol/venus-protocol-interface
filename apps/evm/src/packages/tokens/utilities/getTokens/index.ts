import { ChainId } from 'types';

import { tokens } from '../../infos/commonTokens';

export interface GetTokensInput {
  chainId: ChainId;
}

export const getTokens = ({ chainId }: GetTokensInput) => tokens[chainId];

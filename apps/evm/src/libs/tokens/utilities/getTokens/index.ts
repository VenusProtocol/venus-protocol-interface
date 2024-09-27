import type { ChainId } from '@venusprotocol/chains';

import { tokens } from '../../infos/commonTokens';

export interface GetTokensInput {
  chainId: ChainId;
}

export const getTokens = ({ chainId }: GetTokensInput) => tokens[chainId];

import type { ChainId } from 'types';

import { pancakeSwapTokens } from '../../infos/pancakeSwapTokens';

export interface GetPancakeSwapTokensInput {
  chainId: ChainId;
}

export const getPancakeSwapTokens = ({ chainId }: GetPancakeSwapTokensInput) =>
  pancakeSwapTokens[chainId];

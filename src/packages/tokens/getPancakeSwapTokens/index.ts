import { ChainId } from 'types';

import pancakeSwapTokens from '../tokenInfos/pancakeSwap';

export interface GetPancakeSwapTokensInput {
  chainId: ChainId;
}

export const getPancakeSwapTokens = ({ chainId }: GetPancakeSwapTokensInput) =>
  pancakeSwapTokens[chainId];

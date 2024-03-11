import { pancakeSwapTokens } from 'libs/tokens/infos/pancakeSwapTokens';
import type { ChainId } from 'types';

export interface GetPancakeSwapTokensInput {
  chainId: ChainId;
}

export const getPancakeSwapTokens = ({ chainId }: GetPancakeSwapTokensInput) =>
  pancakeSwapTokens[chainId];

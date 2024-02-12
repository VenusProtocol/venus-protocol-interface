import { pancakeSwapTokens } from 'packages/tokens/infos/pancakeSwapTokens';
import { ChainId } from 'types';

export interface GetPancakeSwapTokensInput {
  chainId: ChainId;
}

export const getPancakeSwapTokens = ({ chainId }: GetPancakeSwapTokensInput) =>
  pancakeSwapTokens[chainId];

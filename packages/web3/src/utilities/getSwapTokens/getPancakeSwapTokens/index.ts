import { pancakeSwapTokens } from 'tokens';

import { ChainId } from 'types';

export const getPancakeSwapTokens = ({ chainId }: { chainId: ChainId }) =>
  pancakeSwapTokens[chainId];

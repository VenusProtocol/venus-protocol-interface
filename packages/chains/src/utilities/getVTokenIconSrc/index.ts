import { vTokens } from '../../tokens/vTokenIconSrcs';
import type { ChainId } from '../../types';

export const getVTokenIconSrc = ({
  vTokenAddress,
  chainId,
}: { vTokenAddress: string; chainId: ChainId }): string | undefined => {
  const chainvTokenIconSrcs = vTokens[chainId];

  return chainvTokenIconSrcs[vTokenAddress.toLowerCase()];
};

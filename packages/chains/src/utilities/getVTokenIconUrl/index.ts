import { vTokens } from '../../tokenMetadata/vTokenIconUrls';
import type { ChainId } from '../../types';

export const getVTokenIconUrl = ({
  vTokenAddress,
  chainId,
}: { vTokenAddress: string; chainId: ChainId }): string | undefined => {
  const chainVTokenIconUrls = vTokens[chainId];

  return chainVTokenIconUrls[vTokenAddress.toLowerCase()];
};

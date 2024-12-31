import { vTokenAssetsPerChainId } from 'libs/tokens/infos/vTokens';
import type { ChainId } from 'types';

export const getVTokenAsset = ({
  vTokenAddress,
  chainId,
}: { vTokenAddress: string; chainId: ChainId }): string | undefined => {
  const chainVTokenAssets = vTokenAssetsPerChainId[chainId];

  return chainVTokenAssets[vTokenAddress.toLowerCase()];
};

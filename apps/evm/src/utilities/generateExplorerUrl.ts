import { chainMetadata } from '@venusprotocol/chains';
import type { ChainId } from 'types';

export type UrlType = 'address' | 'token' | 'tx' | 'layerZeroTx';

export interface GenerateChainExplorerUrlInput<T extends UrlType = 'address'> {
  hash: string;
  chainId: ChainId;
  urlType?: T;
}

const generateLayerZeroScanUrl = ({ hash, chainId }: GenerateChainExplorerUrlInput) => {
  const { layerZeroScanUrl } = chainMetadata[chainId];
  return `${layerZeroScanUrl}/tx/${hash}`;
};

export const generateExplorerUrl = <T extends UrlType = 'address'>({
  hash,
  urlType,
  chainId,
}: GenerateChainExplorerUrlInput<T>) => {
  const safeUrlType = urlType || 'address';

  if (safeUrlType === 'layerZeroTx') {
    return generateLayerZeroScanUrl({ hash, chainId });
  }

  const { explorerUrl } = chainMetadata[chainId];
  return `${explorerUrl}/${safeUrlType}/${hash}`;
};

export default generateExplorerUrl;

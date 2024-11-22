import { CHAIN_METADATA } from 'constants/chainMetadata';
import type { ChainId } from 'types';

export type UrlType = 'address' | 'token' | 'tx' | 'layerZeroTx';

export interface generateExplorerUrlInput<T extends UrlType = 'address'> {
  hash: string;
  chainId: ChainId;
  urlType?: T;
}

const generateLayerZeroScanUrl = ({ hash, chainId }: generateExplorerUrlInput) => {
  const { layerZeroScanUrl } = CHAIN_METADATA[chainId];
  return `${layerZeroScanUrl}/tx/${hash}`;
};

export const generateExplorerUrl = <T extends UrlType = 'address'>({
  hash,
  urlType,
  chainId,
}: generateExplorerUrlInput<T>) => {
  const safeUrlType = urlType || 'address';

  if (safeUrlType === 'layerZeroTx') {
    return generateLayerZeroScanUrl({ hash, chainId });
  }

  const { explorerUrl } = CHAIN_METADATA[chainId];
  return `${explorerUrl}/${safeUrlType}/${hash}`;
};

export default generateExplorerUrl;

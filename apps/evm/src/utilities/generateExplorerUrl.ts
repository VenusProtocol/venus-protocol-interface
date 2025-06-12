import { chainMetadata } from '@venusprotocol/chains';
import { MEE_SCAN_URL } from 'constants/biconomy';
import type { ChainId } from 'types';

export type UrlType = 'address' | 'token' | 'tx' | 'layerZeroTx' | 'biconomyTx';

export interface GenerateChainExplorerUrlInput<T extends UrlType = 'address'> {
  hash: string;
  chainId: ChainId;
  urlType?: T;
}

const generateLayerZeroScanUrl = ({ hash, chainId }: GenerateChainExplorerUrlInput) => {
  const { layerZeroScanUrl } = chainMetadata[chainId];
  return `${layerZeroScanUrl}/tx/${hash}`;
};

const generateBiconomyScanUrl = ({ hash }: { hash: string }) => {
  return `${MEE_SCAN_URL}/details/${hash}`;
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

  if (safeUrlType === 'biconomyTx') {
    return generateBiconomyScanUrl({ hash });
  }

  const { explorerUrl } = chainMetadata[chainId];
  return `${explorerUrl}/${safeUrlType}/${hash}`;
};

export default generateExplorerUrl;

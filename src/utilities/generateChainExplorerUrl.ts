import { CHAIN_METADATA } from 'constants/chainMetadata';
import { ChainId } from 'types';

export type UrlType = 'address' | 'token' | 'tx' | 'lztx';

export interface GenerateChainExplorerUrlInput<T extends UrlType = 'address'> {
  hash: string;
  chainId: ChainId;
  urlType?: T;
}

const generateLayerZeroScanUrl = ({ hash, chainId }: GenerateChainExplorerUrlInput) => {
  const { layerZeroScanUrl } = CHAIN_METADATA[chainId];
  return `${layerZeroScanUrl}/tx/${hash}`;
};

export const generateChainExplorerUrl = <T extends UrlType = 'address'>({
  hash,
  urlType,
  chainId,
}: GenerateChainExplorerUrlInput<T>) => {
  const safeUrlType = urlType || 'address';

  if (safeUrlType === 'lztx') {
    return generateLayerZeroScanUrl({ hash, chainId });
  }

  const { explorerUrl } = CHAIN_METADATA[chainId];
  return `${explorerUrl}/${safeUrlType}/${hash}`;
};

export default generateChainExplorerUrl;

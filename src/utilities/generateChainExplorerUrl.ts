import { ChainId } from 'types';

import { CHAIN_METADATA } from 'constants/chainMetadata';

export type UrlType = 'address' | 'token' | 'tx';

export interface GenerateChainExplorerUrlInput<T extends UrlType = 'address'> {
  hash: string;
  chainId: ChainId;
  urlType?: T;
}

export const generateChainExplorerUrl = <T extends UrlType = 'address'>({
  hash,
  urlType,
  chainId,
}: GenerateChainExplorerUrlInput<T>) => {
  const safeUrlType = urlType || 'address';
  const { explorerUrl } = CHAIN_METADATA[chainId];
  return `${explorerUrl}/${safeUrlType}/${hash}`;
};

export default generateChainExplorerUrl;

import { ChainId } from 'types';

import { EXPLORER_URLS } from 'constants/bsc';

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
  const explorerUrl = EXPLORER_URLS[chainId];
  return `${explorerUrl}/${safeUrlType}/${hash}`;
};

export default generateChainExplorerUrl;

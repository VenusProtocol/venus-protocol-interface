import { ChainId } from 'packages/contracts';

import { EXPLORER_URLS } from 'constants/bsc';

export type UrlType = 'address' | 'token' | 'tx';

export interface GenerateBscScanUrlInput<T extends UrlType = 'address'> {
  hash: string;
  chainId: ChainId;
  urlType?: T;
}

export const generateBscScanUrl = <T extends UrlType = 'address'>({
  hash,
  urlType,
  chainId,
}: GenerateBscScanUrlInput<T>) => {
  const safeUrlType = urlType || 'address';
  const explorerUrl = EXPLORER_URLS[chainId];
  return `${explorerUrl}/${safeUrlType}/${hash}`;
};

export default generateBscScanUrl;

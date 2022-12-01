import config from 'config';

export type UrlType = 'address' | 'token' | 'tx';

export const generateBscScanUrl = <T extends UrlType = 'address'>(hash: string, urlType?: T) => {
  const safeUrlType = urlType || 'address';
  return `${config.bscScanUrl}/${safeUrlType}/${hash}`;
};

export default generateBscScanUrl;

import config from 'config';
import { TokenId } from 'types';

import unsafeGetToken from './unsafeGetToken';

export type UrlType = 'address' | 'token' | 'tx';

export const generateBscScanUrl = <T extends UrlType = 'address'>(
  identifier: T extends 'token' ? TokenId : string,
  urlType?: T,
) => {
  const safeUrlType = urlType || 'address';

  let suffix: string = identifier;
  if (safeUrlType === 'token') {
    suffix = unsafeGetToken(identifier).address;
  }

  return `${config.bscScanUrl}/${safeUrlType}/${suffix}`;
};

export default generateBscScanUrl;

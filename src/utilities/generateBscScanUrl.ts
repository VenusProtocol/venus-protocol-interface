import { BASE_BSC_SCAN_URL } from 'config';
import { TokenId } from 'types';
import { getToken } from 'utilities';

export type UrlType = 'address' | 'token' | 'tx';

export const generateBscScanUrl = <T extends UrlType = 'address'>(
  identifier: T extends 'token' ? TokenId : string,
  urlType?: T,
) => {
  let suffix: string = identifier;

  if (urlType === 'token') {
    suffix = getToken(identifier as TokenId).address;
  }

  return `${BASE_BSC_SCAN_URL}/${urlType}/${suffix}`;
};

export default generateBscScanUrl;

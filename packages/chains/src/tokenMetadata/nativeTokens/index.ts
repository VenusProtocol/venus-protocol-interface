import { NATIVE_TOKEN_ADDRESS } from '../../constants';
import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { Token } from '../../types';

export const eth: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'ETH',
  asset: tokenIconUrls.eth,
  isNative: true,
};

export const bnb: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'BNB',
  asset: tokenIconUrls.bnb,
  isNative: true,
};

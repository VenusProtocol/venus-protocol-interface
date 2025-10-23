import { NATIVE_TOKEN_ADDRESS } from '../../constants';
import { iconSrcs } from '../../generated/manifests/tokenIcons';
import type { Token } from '../../types';

export const eth: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'ETH',
  iconSrc: iconSrcs.eth,
  isNative: true,
};

export const bnb: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'BNB',
  iconSrc: iconSrcs.bnb,
  isNative: true,
};

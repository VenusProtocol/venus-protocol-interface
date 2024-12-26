import { NATIVE_TOKEN_ADDRESS } from '../constants';
import bnbLogo from '../img/tokens/bnb.svg';
import ethLogo from '../img/tokens/eth.svg';
import type { Token } from '../types';

export const bnb: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'BNB',
  asset: bnbLogo,
  isNative: true,
};

export const eth: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'ETH',
  asset: ethLogo,
  isNative: true,
};

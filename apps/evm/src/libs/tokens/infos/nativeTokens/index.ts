import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import bnbLogo from 'libs/tokens/img/underlyingTokens/bnb.svg';
import ethLogo from 'libs/tokens/img/underlyingTokens/eth.svg';
import type { Token } from 'types';

export const eth: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'ETH',
  asset: ethLogo,
  isNative: true,
};

export const bnb: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'BNB',
  asset: bnbLogo,
  isNative: true,
};

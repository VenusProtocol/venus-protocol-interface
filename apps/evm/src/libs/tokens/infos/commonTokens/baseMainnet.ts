import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import ethLogo from 'libs/tokens/img/eth.svg';
import type { Token } from 'types';

const ethToken: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'ETH',
  asset: ethLogo,
  isNative: true,
};

export const tokens: Token[] = [ethToken];

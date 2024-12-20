import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import bnbLogo from 'libs/tokens/img/underlyingTokens/bnb.svg';
import btcbLogo from 'libs/tokens/img/underlyingTokens/btcb.svg';
import ethLogo from 'libs/tokens/img/underlyingTokens/eth.svg';
import usdtLogo from 'libs/tokens/img/underlyingTokens/usdt.svg';
import wbnbLogo from 'libs/tokens/img/underlyingTokens/wbnb.svg';
import xvsLogo from 'libs/tokens/img/underlyingTokens/xvs.svg';
import type { Token } from 'types';

const bnbToken: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'BNB',
  asset: bnbLogo,
  isNative: true,
};

export const tokens: Token[] = [
  bnbToken,
  {
    address: '0xc2931B1fEa69b6D6dA65a50363A8D75d285e4da9',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x94680e003861D43C6c0cf18333972312B6956FF1',
    decimals: 18,
    symbol: 'ETH',
    asset: ethLogo,
  },
  {
    address: '0x8ac9B3801D0a8f5055428ae0bF301CA1Da976855',
    decimals: 18,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    symbol: 'WBNB',
    decimals: 18,
    address: '0x4200000000000000000000000000000000000006',
    asset: wbnbLogo,
    tokenWrapped: bnbToken,
  },
  {
    symbol: 'BTCB',
    decimals: 18,
    address: '0x7Af23F9eA698E9b953D2BD70671173AaD0347f19',
    asset: btcbLogo,
  },
];

import bnbLogo from 'libs/tokens/img/bnb.svg';
import xvsLogo from 'libs/tokens/img/xvs.svg';
import { Token } from 'types';

export const tokens: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    symbol: 'BNB',
    asset: bnbLogo,
    isNative: true,
  },
  {
    address: '0x3E2e61F1c075881F3fB8dd568043d8c221fd5c61',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
];

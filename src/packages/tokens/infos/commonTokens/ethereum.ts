import ethLogo from 'packages/tokens/img/eth.svg';
import xvsLogo from 'packages/tokens/img/xvs.svg';
import { Token } from 'types';

export const tokens: Token[] = [
  {
    address: '0xd3CC9d8f3689B83c91b7B59cAB4946B063EB894A',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    symbol: 'ETH',
    asset: ethLogo,
    isNative: true,
  },
];

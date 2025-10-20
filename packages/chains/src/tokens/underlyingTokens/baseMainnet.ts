import { iconSrcs } from '../../generated/manifests/tokenIcons';
import type { Token } from '../../types';
import { eth } from '../nativeTokens';

export const baseMainnet: Token[] = [
  eth,
  {
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    symbol: 'WETH',
    iconSrc: iconSrcs.weth,
    tokenWrapped: eth,
  },
  {
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    decimals: 8,
    symbol: 'cbBTC',
    iconSrc: iconSrcs.cbbtc,
  },
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    symbol: 'USDC',
    iconSrc: iconSrcs.usdc,
  },
  {
    address: '0xebB7873213c8d1d9913D8eA39Aa12d74cB107995',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    address: '0x7FcD174E80f264448ebeE8c88a7C4476AAF58Ea6',
    decimals: 18,
    symbol: 'wsuperOETHb',
    iconSrc: iconSrcs.wSuperOEthB,
  },
  {
    address: '0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452',
    decimals: 18,
    symbol: 'wstETH',
    iconSrc: iconSrcs.wstEth,
  },
];

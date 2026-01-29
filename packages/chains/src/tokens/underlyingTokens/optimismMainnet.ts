import { iconSrcs } from '../../generated/manifests/tokenIcons';
import { ChainId, type Token } from '../../types';
import { eth } from '../nativeTokens';

export const optimismMainnet: Token[] = [
  eth[ChainId.OPTIMISM_MAINNET],
  {
    chainId: ChainId.OPTIMISM_MAINNET,
    address: '0x4a971e87ad1F61f7f3081645f52a99277AE917cF',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    chainId: ChainId.OPTIMISM_MAINNET,
    address: '0x4200000000000000000000000000000000000042',
    decimals: 18,
    symbol: 'OP',
    iconSrc: iconSrcs.op,
  },
  {
    chainId: ChainId.OPTIMISM_MAINNET,
    address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
    decimals: 8,
    symbol: 'WBTC',
    iconSrc: iconSrcs.wbtc,
  },
  {
    chainId: ChainId.OPTIMISM_MAINNET,
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    symbol: 'WETH',
    iconSrc: iconSrcs.weth,
    tokenWrapped: eth[ChainId.OPTIMISM_MAINNET],
  },
  {
    chainId: ChainId.OPTIMISM_MAINNET,
    address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    decimals: 6,
    symbol: 'USDT',
    iconSrc: iconSrcs.usdt,
  },
  {
    chainId: ChainId.OPTIMISM_MAINNET,
    address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    decimals: 6,
    symbol: 'USDC',
    iconSrc: iconSrcs.usdc,
  },
];

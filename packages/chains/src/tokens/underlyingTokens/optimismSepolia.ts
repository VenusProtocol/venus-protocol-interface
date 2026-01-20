import { iconSrcs } from '../../generated/manifests/tokenIcons';
import { ChainId, type Token } from '../../types';
import { eth } from '../nativeTokens';

export const optimismSepolia: Token[] = [
  eth[ChainId.OPTIMISM_SEPOLIA],
  {
    chainId: ChainId.OPTIMISM_SEPOLIA,
    address: '0x789482e37218f9b26d8D9115E356462fA9A37116',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    chainId: ChainId.OPTIMISM_SEPOLIA,
    address: '0xEC5f6eB84677F562FC568B89121C5E5C19639776',
    decimals: 18,
    symbol: 'OP',
    iconSrc: iconSrcs.op,
  },
  {
    chainId: ChainId.OPTIMISM_SEPOLIA,
    address: '0x9f5039a86AF12AB10Ff16659eA0885bb4C04d013',
    decimals: 8,
    symbol: 'WBTC',
    iconSrc: iconSrcs.wbtc,
  },
  {
    chainId: ChainId.OPTIMISM_SEPOLIA,
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    symbol: 'WETH',
    iconSrc: iconSrcs.weth,
    tokenWrapped: eth[ChainId.OPTIMISM_SEPOLIA],
  },
  {
    chainId: ChainId.OPTIMISM_SEPOLIA,
    address: '0x9AD0542c71c09B764cf58d38918892F3Ae7ecc63',
    decimals: 6,
    symbol: 'USDT',
    iconSrc: iconSrcs.usdt,
  },
  {
    chainId: ChainId.OPTIMISM_SEPOLIA,
    address: '0x71B49d40B10Aa76cc44954e821eB6eA038Cf196F',
    decimals: 6,
    symbol: 'USDC',
    iconSrc: iconSrcs.usdc,
  },
];

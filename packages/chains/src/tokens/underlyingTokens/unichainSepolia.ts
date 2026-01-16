import { iconSrcs } from '../../generated/manifests/tokenIcons';
import { ChainId, type Token } from '../../types';
import { eth } from '../nativeTokens';

export const unichainSepolia: Token[] = [
  eth[ChainId.UNICHAIN_SEPOLIA],
  {
    chainId: ChainId.UNICHAIN_SEPOLIA,
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    symbol: 'WETH',
    iconSrc: iconSrcs.weth,
    tokenWrapped: eth[ChainId.UNICHAIN_SEPOLIA],
  },
  {
    chainId: ChainId.UNICHAIN_SEPOLIA,
    address: '0x2979ef1676bb28192ac304173C717D7322b3b586',
    decimals: 8,
    symbol: 'cbBTC',
    iconSrc: iconSrcs.cbbtc,
  },
  {
    chainId: ChainId.UNICHAIN_SEPOLIA,
    address: '0xf16d4774893eB578130a645d5c69E9c4d183F3A5',
    decimals: 6,
    symbol: 'USDC',
    iconSrc: iconSrcs.usdc,
  },
  {
    chainId: ChainId.UNICHAIN_SEPOLIA,
    address: '0x7bc1b67fde923fd3667Fde59684c6c354C8EbFdA',
    decimals: 6,
    symbol: 'USDT',
    iconSrc: iconSrcs.usdt,
  },
  {
    chainId: ChainId.UNICHAIN_SEPOLIA,
    address: '0xC0e51E865bc9Fed0a32Cc0B2A65449567Bc5c741',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    chainId: ChainId.UNICHAIN_SEPOLIA,
    address: '0x873A6C4B1e3D883920541a0C61Dc4dcb772140b3',
    decimals: 18,
    symbol: 'UNI',
    iconSrc: iconSrcs.uni,
  },
  {
    chainId: ChainId.UNICHAIN_SEPOLIA,
    address: '0x3B3aCc90D848981E69052FD461123EA19dca6cAF',
    decimals: 18,
    symbol: 'weETH',
    iconSrc: iconSrcs.weEth,
  },
  {
    chainId: ChainId.UNICHAIN_SEPOLIA,
    address: '0x114B3fD3dA17F8EDBc19a3AEE43aC168Ca5b03b4',
    decimals: 18,
    symbol: 'wstETH',
    iconSrc: iconSrcs.wstEth,
  },
  {
    chainId: ChainId.UNICHAIN_SEPOLIA,
    address: '0x6f64364A62F9c0eb102b54E0dDa7666E1d3266aB',
    decimals: 6,
    symbol: 'USD₮0',
    iconSrc: iconSrcs.usdt0,
  },
  {
    chainId: ChainId.UNICHAIN_SEPOLIA,
    address: '0x0f850f13fd273348046f1BaDc5aCb80271A672C4',
    decimals: 8,
    symbol: 'WBTC',
    iconSrc: iconSrcs.wbtc,
  },
];

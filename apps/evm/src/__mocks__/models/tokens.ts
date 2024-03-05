import bnbLogo from 'libs/tokens/img/bnb.svg';
import busdLogo from 'libs/tokens/img/busd.svg';
import ethLogo from 'libs/tokens/img/eth.svg';
import lisUsdLogo from 'libs/tokens/img/lisUSD.png';
import lunaLogo from 'libs/tokens/img/luna.svg';
import usdcLogo from 'libs/tokens/img/usdc.svg';
import usdtLogo from 'libs/tokens/img/usdt.svg';
import ustLogo from 'libs/tokens/img/ust.svg';
import vaiLogo from 'libs/tokens/img/vai.svg';
import vrtLogo from 'libs/tokens/img/vrt.svg';
import wbnbLogo from 'libs/tokens/img/wbnb.svg';
import wethLogo from 'libs/tokens/img/weth.svg';
import xvsLogo from 'libs/tokens/img/xvs.svg';
import { Token } from 'types';

export const xvs: Token = {
  address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
  decimals: 18,
  symbol: 'XVS',
  asset: xvsLogo,
};

export const vai: Token = {
  address: '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
  decimals: 18,
  symbol: 'VAI',
  asset: vaiLogo,
};

export const vrt: Token = {
  address: '0x331F639B4F3CF6E391CD244e0b5027C5968Ec325',
  decimals: 18,
  symbol: 'VRT',
  asset: vrtLogo,
};

export const bnb: Token = {
  address: '0x0000000000000000000000000000000000000000',
  isNative: true,
  decimals: 18,
  symbol: 'BNB',
  asset: bnbLogo,
};

export const usdc: Token = {
  address: '0x16227D60f7a0e586C66B005219dfc887D13C9531',
  decimals: 6,
  symbol: 'USDC',
  asset: usdcLogo,
};

export const usdt: Token = {
  address: '0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c',
  decimals: 6,
  symbol: 'USDT',
  asset: usdtLogo,
};

export const busd: Token = {
  address: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47',
  decimals: 18,
  symbol: 'BUSD',
  asset: busdLogo,
};

export const ust: Token = {
  address: '0x5A79efD958432E72211ee73D5DDFa9bc8f248b5F',
  decimals: 18,
  symbol: 'UST',
  asset: ustLogo,
};

export const luna: Token = {
  address: '0xf36160EC62E3B191EA375dadfe465E8Fa1F8CabB',
  decimals: 6,
  symbol: 'LUNA',
  asset: lunaLogo,
};

export const wbnb: Token = {
  symbol: 'WBNB',
  decimals: 18,
  address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  asset: wbnbLogo,
};

export const eth: Token = {
  address: '0x98f7A83361F7Ac8765CcEBAB1425da6b341958a7',
  decimals: 18,
  symbol: 'ETH',
  asset: ethLogo,
  isNative: true,
};

export const weth: Token = {
  address: '0x700868CAbb60e90d77B6588ce072d9859ec8E281',
  decimals: 18,
  symbol: 'WETH',
  asset: wethLogo,
  tokenWrapped: eth,
};

export const lisUsd: Token = {
  address: '0xe73774DfCD551BF75650772dC2cC56a2B6323453',
  decimals: 18,
  symbol: 'lisUSD',
  asset: lisUsdLogo,
};

export default [xvs, bnb, usdc, usdt, busd, ust, luna, vai, wbnb, eth, vrt, lisUsd];

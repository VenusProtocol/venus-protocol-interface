import { Token, VenusTokenSymbol } from 'types';

export const xvs: Token = {
  address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
  decimals: 18,
  symbol: VenusTokenSymbol.XVS,
  asset: '',
};

export const vai: Token = {
  address: '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
  decimals: 18,
  symbol: 'VAI',
  asset: '',
};

export const bnb: Token = {
  address: '0x0000000000000000000000000000000000000000',
  isNative: true,
  decimals: 18,
  symbol: 'BNB',
  asset: '',
};

export const usdc: Token = {
  address: '0x16227D60f7a0e586C66B005219dfc887D13C9531',
  decimals: 6,
  symbol: 'USDC',
  asset: '',
};

export const usdt: Token = {
  address: '0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c',
  decimals: 6,
  symbol: 'USDT',
  asset: '',
};

export const busd: Token = {
  address: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47',
  decimals: 18,
  symbol: 'BUSD',
  asset: '',
};

export const ust: Token = {
  address: '0x5A79efD958432E72211ee73D5DDFa9bc8f248b5F',
  decimals: 18,
  symbol: 'UST',
  asset: '',
};

export const luna: Token = {
  address: '0xf36160EC62E3B191EA375dadfe465E8Fa1F8CabB',
  decimals: 6,
  symbol: 'LUNA',
  asset: '',
};

export const wbnb: Token = {
  symbol: 'WBNB',
  decimals: 18,
  address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  asset: '',
};

export const eth: Token = {
  address: '0x98f7A83361F7Ac8765CcEBAB1425da6b341958a7',
  decimals: 18,
  symbol: 'ETH',
  asset: '',
};

export default [xvs, bnb, usdc, usdt, busd, ust, luna, vai, wbnb, eth];

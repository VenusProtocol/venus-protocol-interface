import type { Token } from 'types';

// Note: we don't import ChainId because this causes some hoisting issues with tests
const BSC_TESTNET_ID = 97;

export const xvs: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
  decimals: 18,
  symbol: 'XVS',
  iconSrc: 'fake-xvs-asset',
};

export const vai: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
  decimals: 18,
  symbol: 'VAI',
  iconSrc: 'fake-vai-asset',
};

export const vrt: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0x331F639B4F3CF6E391CD244e0b5027C5968Ec325',
  decimals: 18,
  symbol: 'VRT',
  iconSrc: 'fake-vrt-asset',
};

export const bnb: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  isNative: true,
  decimals: 18,
  symbol: 'BNB',
  iconSrc: 'fake-bnb-asset',
};

export const usdc: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0x16227D60f7a0e586C66B005219dfc887D13C9531',
  decimals: 6,
  symbol: 'USDC',
  iconSrc: 'fake-usdc-asset',
};

export const usdt: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c',
  decimals: 6,
  symbol: 'USDT',
  iconSrc: 'fake-usdt-asset',
};

export const busd: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47',
  decimals: 18,
  symbol: 'BUSD',
  iconSrc: 'fake-busd-asset',
};

export const ust: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0x5A79efD958432E72211ee73D5DDFa9bc8f248b5F',
  decimals: 18,
  symbol: 'UST',
  iconSrc: 'fake-ust-asset',
};

export const luna: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0xf36160EC62E3B191EA375dadfe465E8Fa1F8CabB',
  decimals: 6,
  symbol: 'LUNA',
  iconSrc: 'fake-luna-asset',
};

export const wbnb: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  decimals: 18,
  symbol: 'WBNB',
  iconSrc: 'fake-wbnb-asset',
};

export const eth: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0x98f7A83361F7Ac8765CcEBAB1425da6b341958a7',
  decimals: 18,
  symbol: 'ETH',
  iconSrc: 'fake-eth-asset',
  isNative: true,
};

export const weth: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0x700868CAbb60e90d77B6588ce072d9859ec8E281',
  decimals: 18,
  symbol: 'WETH',
  iconSrc: 'fake-weth-asset',
  tokenWrapped: eth,
};

export const lisUsd: Token = {
  chainId: BSC_TESTNET_ID,
  address: '0xe73774DfCD551BF75650772dC2cC56a2B6323453',
  decimals: 18,
  symbol: 'lisUSD',
  iconSrc: 'fake-lisusd-asset',
};

export default [xvs, bnb, usdc, usdt, busd, ust, luna, vai, wbnb, weth, eth, vrt, lisUsd];

import { Token } from 'types';

import aave from 'assets/img/tokens/aave.svg';
import ada from 'assets/img/tokens/ada.svg';
import bnb from 'assets/img/tokens/bnb.svg';
import btcb from 'assets/img/tokens/btcb.svg';
import busd from 'assets/img/tokens/busd.svg';
import cake from 'assets/img/tokens/cake.svg';
import doge from 'assets/img/tokens/doge.svg';
import eth from 'assets/img/tokens/eth.svg';
import ltc from 'assets/img/tokens/ltc.svg';
import luna from 'assets/img/tokens/luna.svg';
import matic from 'assets/img/tokens/matic.svg';
import sxp from 'assets/img/tokens/sxp.svg';
import trx from 'assets/img/tokens/trx.svg';
import tusd from 'assets/img/tokens/tusd.svg';
import usdc from 'assets/img/tokens/usdc.svg';
import usdt from 'assets/img/tokens/usdt.svg';
import ust from 'assets/img/tokens/ust.svg';
import vai from 'assets/img/tokens/vai.svg';
import vrt from 'assets/img/tokens/vrt.svg';
import xrp from 'assets/img/tokens/xrp.svg';
import xvs from 'assets/img/tokens/xvs.svg';

export const TESTNET_TOKENS = {
  bnb: {
    address: '0x12eb9ef44de5fbea1b2f5ff7a9a375cae9bfb2eb',
    decimals: 18,
    symbol: 'BNB',
    asset: bnb,
    isNative: true,
  } as Token,
  sxp: {
    address: '0x75107940Cf1121232C0559c747A986DEfbc69DA9',
    decimals: 18,
    symbol: 'SXP',
    asset: sxp,
  } as Token,
  usdc: {
    address: '0x16227D60f7a0e586C66B005219dfc887D13C9531',
    decimals: 6,
    symbol: 'USDC',
    asset: usdc,
  } as Token,
  usdt: {
    address: '0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c',
    decimals: 6,
    symbol: 'USDT',
    asset: usdt,
  } as Token,
  busd: {
    address: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47',
    decimals: 18,
    symbol: 'BUSD',
    asset: busd,
  } as Token,
  xvs: {
    address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
    decimals: 18,
    symbol: 'XVS',
    asset: xvs,
  } as Token,
  btcb: {
    address: '0xA808e341e8e723DC6BA0Bb5204Bafc2330d7B8e4',
    decimals: 18,
    symbol: 'BTCB',
    asset: btcb,
  } as Token,
  eth: {
    address: '0x98f7A83361F7Ac8765CcEBAB1425da6b341958a7',
    decimals: 18,
    symbol: 'ETH',
    asset: eth,
  } as Token,
  ltc: {
    address: '0x969F147B6b8D81f86175de33206A4FD43dF17913',
    decimals: 18,
    symbol: 'LTC',
    asset: ltc,
  } as Token,
  xrp: {
    address: '0x3022A32fdAdB4f02281E8Fab33e0A6811237aab0',
    decimals: 18,
    symbol: 'XRP',
    asset: xrp,
  } as Token,
  ada: {
    address: '0xcD34BC54106bd45A04Ed99EBcC2A6a3e70d7210F',
    decimals: 18,
    symbol: 'ADA',
    asset: ada,
  } as Token,
  doge: {
    address: '0x67D262CE2b8b846d9B94060BC04DC40a83F0e25B',
    decimals: 8,
    symbol: 'DOGE',
    asset: doge,
  } as Token,
  matic: {
    address: '0xcfeb0103d4BEfa041EA4c2dACce7B3E83E1aE7E3',
    decimals: 18,
    symbol: 'MATIC',
    asset: matic,
  } as Token,
  cake: {
    address: '0xe8bd7cCC165FAEb9b81569B05424771B9A20cbEF',
    decimals: 18,
    symbol: 'CAKE',
    asset: cake,
  } as Token,
  aave: {
    address: '0x4B7268FC7C727B88c5Fc127D41b491BfAe63e144',
    decimals: 18,
    symbol: 'AAVE',
    asset: aave,
  } as Token,
  tusd: {
    address: '0xFeC3A63401Eb9C1476200d7C32c4009Be0154169',
    decimals: 18,
    symbol: 'TUSD',
    asset: tusd,
  } as Token,
  trx: {
    address: '0x19E7215abF8B2716EE807c9f4b83Af0e7f92653F',
    decimals: 18,
    symbol: 'TRX',
    asset: trx,
  } as Token,
  ust: {
    address: '0x5A79efD958432E72211ee73D5DDFa9bc8f248b5F',
    decimals: 18,
    symbol: 'UST',
    asset: ust,
  } as Token,
  luna: {
    address: '0xf36160EC62E3B191EA375dadfe465E8Fa1F8CabB',
    decimals: 6,
    symbol: 'LUNA',
    asset: luna,
  } as Token,
  vai: {
    address: '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
    decimals: 18,
    symbol: 'VAI',
    asset: vai,
  } as Token,
  vrt: {
    address: '0x331F639B4F3CF6E391CD244e0b5027C5968Ec325',
    decimals: 18,
    symbol: 'VRT',
    asset: vrt,
  } as Token,
  bnx: {
    address: '0xa14C236372228B6e8182748F3eBbFb4BFEEA3574',
    decimals: 18,
    symbol: 'BNX',
    asset: xvs, // TODO: add correct asset
  } as Token,
};

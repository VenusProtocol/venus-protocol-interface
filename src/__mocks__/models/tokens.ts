import { Token } from 'types';

import bnb from 'assets/img/tokens/bnb.png';
import busd from 'assets/img/tokens/busd.png';
import sxp from 'assets/img/tokens/sxp.png';
import usdc from 'assets/img/tokens/usdc.png';
import usdt from 'assets/img/tokens/usdt.png';
import vai from 'assets/img/tokens/vai.svg';
import xvs from 'assets/img/tokens/xvs.svg';
import TOKEN_ADDRESSES from 'constants/contracts/addresses/tokens.json';

const tokens = {
  xvs: {
    id: 'xvs',
    symbol: 'XVS',
    decimals: 18,
    address: TOKEN_ADDRESSES.xvs[97],
    asset: xvs,
  } as Token,
  bnb: {
    id: 'bnb',
    symbol: 'BNB',
    decimals: 18,
    address: TOKEN_ADDRESSES.bnb[97],
    asset: bnb,
  } as Token,
  sxp: {
    id: 'sxp',
    symbol: 'SXP',
    decimals: 18,
    address: TOKEN_ADDRESSES.sxp[97],
    asset: sxp,
  } as Token,
  usdc: {
    id: 'usdc',
    symbol: 'USDC',
    decimals: 6,
    address: TOKEN_ADDRESSES.usdc[97],
    asset: usdc,
  } as Token,
  usdt: {
    id: 'usdt',
    symbol: 'USDT',
    decimals: 6,
    address: TOKEN_ADDRESSES.usdt[97],
    asset: usdt,
  } as Token,
  busd: {
    id: 'busd',
    symbol: 'BUSD',
    decimals: 18,
    address: TOKEN_ADDRESSES.busd[97],
    asset: busd,
  } as Token,
  vai: {
    id: 'vai',
    symbol: 'VAI',
    decimals: 18,
    address: TOKEN_ADDRESSES.vai[97],
    asset: vai,
  } as Token,
};

export default tokens;

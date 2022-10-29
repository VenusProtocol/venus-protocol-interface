import { Token } from 'types';

import usdc from 'assets/img/tokens/usdc.png';
import usdt from 'assets/img/tokens/usdt.png';
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
};

export default tokens;

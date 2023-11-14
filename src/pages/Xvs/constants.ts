import BigNumber from 'bignumber.js';

export const MINTED_XVS = '23700000';
export const MINTED_XVS_MANTISSA = new BigNumber(MINTED_XVS).times(new BigNumber(10).pow(18));

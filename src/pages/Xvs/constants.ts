import BigNumber from 'bignumber.js';
import { getToken } from 'utilities';

export const XVS_DECIMALS = getToken('xvs').decimals;
export const MINTED_XVS = '23700000';
export const MINTED_XVS_WEI = new BigNumber(MINTED_XVS).times(new BigNumber(10).pow(XVS_DECIMALS));

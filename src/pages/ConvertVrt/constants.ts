import BigNumber from 'bignumber.js';
import { getToken } from 'utilities';

export const VRT_ID = 'vrt';
export const XVS_ID = 'xvs';
export const CONVERSION_RATIO_DECIMAL = new BigNumber(10).pow(18);
export const VRT_DECIMAL = new BigNumber(10).pow(getToken(VRT_ID).decimals).toNumber();

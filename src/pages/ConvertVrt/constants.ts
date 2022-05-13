import { getToken } from 'utilities';

export const VRT_ID = 'vrt';
export const XVS_ID = 'xvs';
export const CONVERSION_RATIO_DECIMAL = getToken(XVS_ID).decimals;
export const VRT_DECIMAL = getToken(VRT_ID).decimals;

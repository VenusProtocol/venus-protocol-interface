import { getToken } from 'utilities';

export const XVS_TOKEN_ID = 'xvs';
export const XVS_TOKEN_ADDRESS = getToken(XVS_TOKEN_ID).address;
export const XVS_DECIMAL = getToken(XVS_TOKEN_ID).decimals;

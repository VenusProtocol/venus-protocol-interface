import BigNumber from 'bignumber.js';
import { getToken } from 'utilities';
// @TODO magic number
export const MINTED_XVS_WEI = new BigNumber(23700000).times(
  new BigNumber(10).pow(getToken('xvs').decimals),
);

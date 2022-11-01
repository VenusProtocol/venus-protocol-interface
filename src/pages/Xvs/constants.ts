import BigNumber from 'bignumber.js';

import { TOKENS } from 'constants/tokens';

export const MINTED_XVS = '23700000';
export const MINTED_XVS_WEI = new BigNumber(MINTED_XVS).times(
  new BigNumber(10).pow(TOKENS.xvs.decimals),
);

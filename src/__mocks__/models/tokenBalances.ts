import BigNumber from 'bignumber.js';
import { TokenBalance } from 'types';
import { convertTokensToWei } from 'utilities';

import tokens, { busd } from './tokens';

export const FAKE_DEFAULT_BALANCE_TOKENS = '10000';
export const FAKE_BNB_BALANCE_TOKENS = '200000';
export const FAKE_BUSD_BALANCE_TOKENS = '300000';

const tokenBalances: TokenBalance[] = tokens.map(token => {
  let fakeBalanceTokens = FAKE_DEFAULT_BALANCE_TOKENS;

  if (token.isNative) {
    fakeBalanceTokens = FAKE_BNB_BALANCE_TOKENS;
  } else if (token.address === busd.address) {
    fakeBalanceTokens = FAKE_BUSD_BALANCE_TOKENS;
  }

  return {
    token,
    balanceWei: convertTokensToWei({
      value: new BigNumber(fakeBalanceTokens),
      token,
    }),
  };
});

export default tokenBalances;

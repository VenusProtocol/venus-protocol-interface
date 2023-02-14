import { Token } from 'types';

import { TOKENS } from 'constants/tokens';

import areTokensEqual from './areTokensEqual';

export const DISABLED_TOKENS = [TOKENS.ust, TOKENS.luna, TOKENS.sxp];

export const isTokenEnabled = (token: Token) =>
  !DISABLED_TOKENS.some(disabledToken => areTokensEqual(disabledToken, token));
